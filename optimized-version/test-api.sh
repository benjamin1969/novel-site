#!/bin/bash

echo "=== 小说平台API测试脚本 ==="
echo ""

# 检查是否在运行
check_server() {
  if curl -s http://localhost:3000 > /dev/null; then
    echo "✓ 服务器正在运行"
    return 0
  else
    echo "✗ 服务器未运行"
    return 1
  fi
}

# 启动开发服务器
start_server() {
  echo "启动开发服务器..."
  cd /mnt/d/novel-site/optimized-version
  npm run dev &
  SERVER_PID=$!
  
  # 等待服务器启动
  echo "等待服务器启动..."
  for i in {1..30}; do
    if check_server; then
      echo "✓ 服务器启动成功 (PID: $SERVER_PID)"
      return 0
    fi
    sleep 1
  done
  
  echo "✗ 服务器启动失败"
  return 1
}

# 停止服务器
stop_server() {
  if [ ! -z "$SERVER_PID" ]; then
    echo "停止服务器 (PID: $SERVER_PID)..."
    kill $SERVER_PID 2>/dev/null
    wait $SERVER_PID 2>/dev/null
  fi
}

# 清理函数
cleanup() {
  stop_server
  rm -f test_output.json
}

# 设置trap
trap cleanup EXIT

# 测试函数
test_endpoint() {
  local method=$1
  local endpoint=$2
  local data=$3
  local expected_status=$4
  local description=$5
  
  echo ""
  echo "测试: $description"
  echo "端点: $method $endpoint"
  
  local curl_cmd="curl -s -w '%{http_code}' -X $method http://localhost:3000$endpoint"
  
  if [ ! -z "$data" ]; then
    curl_cmd="$curl_cmd -H 'Content-Type: application/json' -d '$data'"
  fi
  
  # 执行请求
  local response
  response=$(eval $curl_cmd)
  
  # 提取状态码和响应体
  local status_code=${response: -3}
  local response_body=${response%???}
  
  echo "状态码: $status_code"
  
  if [ "$status_code" = "$expected_status" ]; then
    echo "✓ 通过"
    
    # 保存响应用于调试
    if [ ! -z "$response_body" ]; then
      echo "$response_body" | jq . 2>/dev/null || echo "$response_body"
    fi
  else
    echo "✗ 失败 - 期望 $expected_status，实际 $status_code"
    if [ ! -z "$response_body" ]; then
      echo "响应: $response_body"
    fi
    return 1
  fi
  
  return 0
}

# 主测试流程
main() {
  echo "1. 检查环境..."
  
  # 检查Node.js
  if ! command -v node &> /dev/null; then
    echo "✗ Node.js未安装"
    exit 1
  fi
  echo "✓ Node.js已安装"
  
  # 检查npm
  if ! command -v npm &> /dev/null; then
    echo "✗ npm未安装"
    exit 1
  fi
  echo "✓ npm已安装"
  
  # 检查jq（可选）
  if ! command -v jq &> /dev/null; then
    echo "⚠ jq未安装，JSON输出可能不美观"
  else
    echo "✓ jq已安装"
  fi
  
  echo ""
  echo "2. 检查项目依赖..."
  cd /mnt/d/novel-site/optimized-version
  
  if [ ! -f "package.json" ]; then
    echo "✗ package.json不存在"
    exit 1
  fi
  
  if [ ! -d "node_modules" ]; then
    echo "⚠ node_modules不存在，尝试安装..."
    npm install
  fi
  
  echo "✓ 项目依赖检查完成"
  
  echo ""
  echo "3. 启动服务器..."
  if ! start_server; then
    exit 1
  fi
  
  echo ""
  echo "4. 开始API测试..."
  
  # 测试计数器
  local passed=0
  local failed=0
  
  # 测试1: 获取小说列表（公开）
  if test_endpoint "GET" "/api/novels" "" "200" "获取小说列表（公开）"; then
    ((passed++))
  else
    ((failed++))
  fi
  
  # 测试2: 注册新用户
  local test_username="testuser_$(date +%s)"
  local register_data="{\"username\":\"$test_username\",\"password\":\"test123456\"}"
  
  if test_endpoint "POST" "/api/auth/register" "$register_data" "201" "注册新用户"; then
    ((passed++))
  else
    ((failed++))
  fi
  
  # 测试3: 用户登录
  local login_data="{\"username\":\"admin\",\"password\":\"admin\"}"
  
  if test_endpoint "POST" "/api/auth/login" "$login_data" "200" "管理员登录"; then
    ((passed++))
    # 提取token用于后续测试
    local response=$(curl -s -X POST http://localhost:3000/api/auth/login \
      -H "Content-Type: application/json" \
      -d "$login_data")
    
    echo "$response" > test_output.json
    ADMIN_TOKEN=$(echo "$response" | jq -r '.data.token' 2>/dev/null)
    
    if [ ! -z "$ADMIN_TOKEN" ] && [ "$ADMIN_TOKEN" != "null" ]; then
      echo "✓ 获取到管理员token"
    fi
  else
    ((failed++))
  fi
  
  # 测试4: 获取用户信息（需要认证）
  if [ ! -z "$ADMIN_TOKEN" ]; then
    if test_endpoint "GET" "/api/auth/me" "" "200" "获取当前用户信息（需要认证）"; then
      ((passed++))
    else
      ((failed++))
    fi
  else
    echo "⚠ 跳过需要认证的测试（无token）"
    ((failed++))
  fi
  
  # 测试5: 获取统计数据
  if test_endpoint "GET" "/api/stats" "" "200" "获取平台统计数据"; then
    ((passed++))
  else
    ((failed++))
  fi
  
  # 测试6: 创建新小说（需要认证）
  if [ ! -z "$ADMIN_TOKEN" ]; then
    local novel_data='{"title":"测试小说","description":"这是一个测试小说","tags":["测试","示例"]}'
    
    # 使用带token的curl
    echo ""
    echo "测试: 创建新小说（需要认证）"
    echo "端点: POST /api/novels"
    
    local response=$(curl -s -w "%{http_code}" -X POST http://localhost:3000/api/novels \
      -H "Content-Type: application/json" \
      -H "Authorization: Bearer $ADMIN_TOKEN" \
      -d "$novel_data")
    
    local status_code=${response: -3}
    
    if [ "$status_code" = "201" ]; then
      echo "✓ 通过"
      ((passed++))
      
      # 提取小说ID用于后续测试
      local novel_response=${response%???}
      NOVEL_ID=$(echo "$novel_response" | jq -r '.data.id' 2>/dev/null)
      
      if [ ! -z "$NOVEL_ID" ] && [ "$NOVEL_ID" != "null" ]; then
        echo "✓ 获取到小说ID: $NOVEL_ID"
      fi
    else
      echo "✗ 失败 - 期望 201，实际 $status_code"
      ((failed++))
    fi
  fi
  
  # 测试7: 获取小说详情
  if [ ! -z "$NOVEL_ID" ]; then
    if test_endpoint "GET" "/api/novels/$NOVEL_ID" "" "200" "获取小说详情"; then
      ((passed++))
    else
      ((failed++))
    fi
  fi
  
  # 测试8: 获取管理员数据（需要管理员权限）
  if [ ! -z "$ADMIN_TOKEN" ]; then
    echo ""
    echo "测试: 获取所有用户（管理员）"
    echo "端点: GET /api/admin/users"
    
    local response=$(curl -s -w "%{http_code}" -X GET http://localhost:3000/api/admin/users \
      -H "Authorization: Bearer $ADMIN_TOKEN")
    
    local status_code=${response: -3}
    
    if [ "$status_code" = "200" ]; then
      echo "✓ 通过"
      ((passed++))
    else
      echo "✗ 失败 - 期望 200，实际 $status_code"
      ((failed++))
    fi
  fi
  
  echo ""
  echo "=== 测试结果 ==="
  echo "通过: $passed"
  echo "失败: $failed"
  echo "总计: $((passed + failed))"
  
  if [ $failed -eq 0 ]; then
    echo "🎉 所有测试通过！"
    return 0
  else
    echo "⚠ 有 $failed 个测试失败"
    return 1
  fi
}

# 运行主函数
main