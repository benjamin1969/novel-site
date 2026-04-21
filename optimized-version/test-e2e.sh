#!/bin/bash

echo "=== 小说平台端到端测试 ==="
echo ""

# 颜色定义
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# 日志函数
log_info() {
  echo -e "${BLUE}[INFO]${NC} $1"
}

log_success() {
  echo -e "${GREEN}[SUCCESS]${NC} $1"
}

log_warning() {
  echo -e "${YELLOW}[WARNING]${NC} $1"
}

log_error() {
  echo -e "${RED}[ERROR]${NC} $1"
}

# 检查命令
check_command() {
  if ! command -v $1 &> /dev/null; then
    log_error "未找到命令: $1"
    log_info "请安装: $2"
    return 1
  fi
  return 0
}

# 测试计数器
TESTS_PASSED=0
TESTS_FAILED=0
TESTS_TOTAL=0

# 记录测试结果
record_test() {
  local test_name="$1"
  local result="$2"
  
  ((TESTS_TOTAL++))
  
  if [ "$result" = "pass" ]; then
    ((TESTS_PASSED++))
    log_success "$test_name"
  else
    ((TESTS_FAILED++))
    log_error "$test_name"
  fi
}

# 启动开发服务器
start_dev_server() {
  log_info "启动开发服务器..."
  
  cd /mnt/d/novel-site/optimized-version
  
  # 检查是否已运行
  if curl -s http://localhost:3000 > /dev/null; then
    log_info "服务器已在运行"
    return 0
  fi
  
  # 启动服务器
  npm run dev > /tmp/novel-server.log 2>&1 &
  SERVER_PID=$!
  
  # 等待服务器启动
  log_info "等待服务器启动 (PID: $SERVER_PID)..."
  
  for i in {1..30}; do
    if curl -s http://localhost:3000 > /dev/null; then
      log_success "服务器启动成功"
      return 0
    fi
    sleep 1
  done
  
  log_error "服务器启动失败"
  log_info "查看日志: /tmp/novel-server.log"
  return 1
}

# 停止开发服务器
stop_dev_server() {
  if [ ! -z "$SERVER_PID" ]; then
    log_info "停止服务器 (PID: $SERVER_PID)..."
    kill $SERVER_PID 2>/dev/null
    wait $SERVER_PID 2>/dev/null
  fi
}

# 清理函数
cleanup() {
  stop_dev_server
  rm -f /tmp/test-*.json
}

# 设置trap
trap cleanup EXIT

# API测试函数
test_api_endpoint() {
  local test_id="$1"
  local method="$2"
  local endpoint="$3"
  local data="$4"
  local expected_status="$5"
  local description="$6"
  
  local output_file="/tmp/test-$test_id.json"
  
  local curl_cmd="curl -s -w '%{http_code}' -o '$output_file' -X $method http://localhost:3000$endpoint"
  
  if [ ! -z "$data" ]; then
    curl_cmd="$curl_cmd -H 'Content-Type: application/json' -d '$data'"
  fi
  
  # 执行请求
  local status_code
  status_code=$(eval $curl_cmd)
  
  if [ "$status_code" = "$expected_status" ]; then
    record_test "$description" "pass"
    return 0
  else
    log_error "期望状态码: $expected_status, 实际: $status_code"
    if [ -f "$output_file" ]; then
      log_info "响应内容: $(cat "$output_file")"
    fi
    record_test "$description" "fail"
    return 1
  fi
}

# 提取JSON字段
extract_json_field() {
  local file="$1"
  local field="$2"
  
  if [ -f "$file" ] && command -v jq &> /dev/null; then
    jq -r "$field" "$file" 2>/dev/null
  fi
}

# 主测试函数
run_e2e_tests() {
  log_info "开始端到端测试..."
  echo ""
  
  # 阶段1: 基础API测试
  log_info "阶段1: 基础API测试"
  echo "----------------------"
  
  # 测试1: 获取小说列表
  test_api_endpoint "001" "GET" "/api/novels" "" "200" "获取小说列表"
  
  # 测试2: 获取统计数据
  test_api_endpoint "002" "GET" "/api/stats" "" "200" "获取平台统计数据"
  
  # 测试3: 注册新用户
  local test_username="testuser_$(date +%s)"
  local register_data="{\"username\":\"$test_username\",\"password\":\"test123456\"}"
  test_api_endpoint "003" "POST" "/api/auth/register" "$register_data" "201" "注册新用户"
  
  # 提取注册的用户ID
  local user_id=$(extract_json_field "/tmp/test-003.json" ".data.id")
  
  # 阶段2: 认证测试
  log_info ""
  log_info "阶段2: 认证测试"
  echo "----------------------"
  
  # 测试4: 用户登录
  local login_data="{\"username\":\"$test_username\",\"password\":\"test123456\"}"
  test_api_endpoint "004" "POST" "/api/auth/login" "$login_data" "200" "用户登录"
  
  # 提取token
  local user_token=$(extract_json_field "/tmp/test-004.json" ".data.token")
  
  # 测试5: 管理员登录
  local admin_login_data='{"username":"admin","password":"admin"}'
  test_api_endpoint "005" "POST" "/api/auth/login" "$admin_login_data" "200" "管理员登录"
  
  # 提取管理员token
  local admin_token=$(extract_json_field "/tmp/test-005.json" ".data.token")
  
  # 阶段3: 认证后API测试
  log_info ""
  log_info "阶段3: 认证后API测试"
  echo "----------------------"
  
  # 测试6: 获取当前用户信息（用户）
  if [ ! -z "$user_token" ]; then
    local output_file="/tmp/test-006.json"
    local status_code=$(curl -s -w '%{http_code}' -o "$output_file" \
      -X GET http://localhost:3000/api/auth/me \
      -H "Authorization: Bearer $user_token")
    
    if [ "$status_code" = "200" ]; then
      record_test "获取当前用户信息（用户）" "pass"
    else
      record_test "获取当前用户信息（用户）" "fail"
    fi
  else
    record_test "获取当前用户信息（用户）" "fail"
  fi
  
  # 测试7: 创建小说（用户）
  if [ ! -z "$user_token" ]; then
    local novel_data='{"title":"我的测试小说","description":"这是一个测试小说","tags":["测试","创作"]}'
    local output_file="/tmp/test-007.json"
    local status_code=$(curl -s -w '%{http_code}' -o "$output_file" \
      -X POST http://localhost:3000/api/novels \
      -H "Content-Type: application/json" \
      -H "Authorization: Bearer $user_token" \
      -d "$novel_data")
    
    if [ "$status_code" = "201" ]; then
      record_test "创建新小说（用户）" "pass"
      # 提取小说ID
      NOVEL_ID=$(extract_json_field "$output_file" ".data.id")
    else
      record_test "创建新小说（用户）" "fail"
    fi
  else
    record_test "创建新小说（用户）" "fail"
  fi
  
  # 阶段4: 小说管理测试
  log_info ""
  log_info "阶段4: 小说管理测试"
  echo "----------------------"
  
  # 测试8: 获取小说详情
  if [ ! -z "$NOVEL_ID" ]; then
    test_api_endpoint "008" "GET" "/api/novels/$NOVEL_ID" "" "200" "获取小说详情"
  else
    record_test "获取小说详情" "skip"
  fi
  
  # 测试9: 创建章节
  if [ ! -z "$NOVEL_ID" ] && [ ! -z "$user_token" ]; then
    local chapter_data="{\"title\":\"第一章\",\"content\":\"这是第一章的内容。\",\"order\":1}"
    local output_file="/tmp/test-009.json"
    local status_code=$(curl -s -w '%{http_code}' -o "$output_file" \
      -X POST http://localhost:3000/api/novels/$NOVEL_ID/chapters \
      -H "Content-Type: application/json" \
      -H "Authorization: Bearer $user_token" \
      -d "$chapter_data")
    
    if [ "$status_code" = "201" ]; then
      record_test "创建章节" "pass"
      # 提取章节ID
      CHAPTER_ID=$(extract_json_field "$output_file" ".data.id")
    else
      record_test "创建章节" "fail"
    fi
  else
    record_test "创建章节" "skip"
  fi
  
  # 测试10: 获取章节列表
  if [ ! -z "$NOVEL_ID" ]; then
    test_api_endpoint "010" "GET" "/api/novels/$NOVEL_ID/chapters" "" "200" "获取章节列表"
  else
    record_test "获取章节列表" "skip"
  fi
  
  # 阶段5: 评论系统测试
  log_info ""
  log_info "阶段5: 评论系统测试"
  echo "----------------------"
  
  # 测试11: 创建评论
  if [ ! -z "$NOVEL_ID" ] && [ ! -z "$user_token" ]; then
    local comment_data="{\"novelId\":\"$NOVEL_ID\",\"content\":\"这是一条测试评论。\"}"
    test_api_endpoint "011" "POST" "/api/comments" "$comment_data" "201" "创建评论"
  else
    record_test "创建评论" "skip"
  fi
  
  # 阶段6: 管理员功能测试
  log_info ""
  log_info "阶段6: 管理员功能测试"
  echo "----------------------"
  
  # 测试12: 获取所有用户（管理员）
  if [ ! -z "$admin_token" ]; then
    local output_file="/tmp/test-012.json"
    local status_code=$(curl -s -w '%{http_code}' -o "$output_file" \
      -X GET http://localhost:3000/api/admin/users \
      -H "Authorization: Bearer $admin_token")
    
    if [ "$status_code" = "200" ]; then
      record_test "获取所有用户（管理员）" "pass"
    else
      record_test "获取所有用户（管理员）" "fail"
    fi
  else
    record_test "获取所有用户（管理员）" "skip"
  fi
  
  # 测试13: 获取所有小说（管理员）
  if [ ! -z "$admin_token" ]; then
    local output_file="/tmp/test-013.json"
    local status_code=$(curl -s -w '%{http_code}' -o "$output_file" \
      -X GET http://localhost:3000/api/admin/novels \
      -H "Authorization: Bearer $admin_token")
    
    if [ "$status_code" = "200" ]; then
      record_test "获取所有小说（管理员）" "pass"
    else
      record_test "获取所有小说（管理员）" "fail"
    fi
  else
    record_test "获取所有小说（管理员）" "skip"
  fi
  
  # 阶段7: 清理测试数据
  log_info ""
  log_info "阶段7: 清理测试数据"
  echo "----------------------"
  
  # 测试14: 删除章节
  if [ ! -z "$NOVEL_ID" ] && [ ! -z "$CHAPTER_ID" ] && [ ! -z "$user_token" ]; then
    local output_file="/tmp/test-014.json"
    local status_code=$(curl -s -w '%{http_code}' -o "$output_file" \
      -X DELETE http://localhost:3000/api/novels/$NOVEL_ID/chapters/$CHAPTER_ID \
      -H "Authorization: Bearer $user_token")
    
    if [ "$status_code" = "200" ]; then
      record_test "删除章节" "pass"
    else
      record_test "删除章节" "fail"
    fi
  else
    record_test "删除章节" "skip"
  fi
  
  # 测试15: 删除小说
  if [ ! -z "$NOVEL_ID" ] && [ ! -z "$user_token" ]; then
    local output_file="/tmp/test-015.json"
    local status_code=$(curl -s -w '%{http_code}' -o "$output_file" \
      -X DELETE http://localhost:3000/api/novels/$NOVEL_ID \
      -H "Authorization: Bearer $user_token")
    
    if [ "$status_code" = "200" ]; then
      record_test "删除小说" "pass"
    else
      record_test "删除小说" "fail"
    fi
  else
    record_test "删除小说" "skip"
  fi
  
  # 显示测试结果
  log_info ""
  log_info "=== 测试结果汇总 ==="
  echo "----------------------"
  log_info "总测试数: $TESTS_TOTAL"
  log_success "通过: $TESTS_PASSED"
  log_error "失败: $TESTS_FAILED"
  
  local skipped=$((TESTS_TOTAL - TESTS_PASSED - TESTS_FAILED))
  if [ $skipped -gt 0 ]; then
    log_warning "跳过: $skipped"
  fi
  
  local pass_rate=0
  if [ $TESTS_TOTAL -gt 0 ]; then
    pass_rate=$((TESTS_PASSED * 100 / TESTS_TOTAL))
  fi
  
  log_info "通过率: $pass_rate%"
  
  if [ $TESTS_FAILED -eq 0 ]; then
    log_success "🎉 所有测试通过！"
    return 0
  else
    log_error "⚠ 有 $TESTS_FAILED 个测试失败"
    return 1
  fi
}

# 主函数
main() {
  echo ""
  log_info "检查系统环境..."
  
  # 检查必要命令
  check_command "node" "Node.js" || exit 1
  check_command "npm" "Node.js包管理器" || exit 1
  check_command "curl" "curl命令行工具" || exit 1
  
  log_success "环境检查通过"
  
  echo ""
  log_info "检查项目状态..."
  
  cd /mnt/d/novel-site/optimized-version
  
  if [ ! -f "package.json" ]; then
    log_error "package.json不存在"
    exit 1
  fi
  
  if [ ! -d "node_modules" ]; then
    log_warning "node_modules不存在，尝试安装依赖..."
    npm install
  fi
  
  log_success "项目检查通过"
  
  echo ""
  # 启动服务器
  if ! start_dev_server; then
    exit 1
  fi
  
  echo ""
  # 运行测试
  if run_e2e_tests; then
    echo ""
    log_success "端到端测试完成！"
  else
    echo ""
    log_error "端到端测试失败"
    exit 1
  fi
}

# 运行主函数
main