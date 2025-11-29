# GitHub Projects V2 API를 사용하여 프로젝트 생성 및 이슈 추가 스크립트

$repo = "kingdom711/studio"
$projectTitle = "Safety Management Studio - Task Roadmap"

# 이슈 번호와 날짜 매핑
$issues = @(
    @{ Number = 3; StartDate = "2025-11-29"; EndDate = "2025-11-30" },
    @{ Number = 4; StartDate = "2025-11-30"; EndDate = "2025-12-01" },
    @{ Number = 5; StartDate = "2025-12-01"; EndDate = "2025-12-02" },
    @{ Number = 6; StartDate = "2025-12-02"; EndDate = "2025-12-03" },
    @{ Number = 7; StartDate = "2025-12-03"; EndDate = "2025-12-05" },
    @{ Number = 8; StartDate = "2025-12-05"; EndDate = "2025-12-07" },
    @{ Number = 9; StartDate = "2025-12-07"; EndDate = "2025-12-10" },
    @{ Number = 10; StartDate = "2025-12-09"; EndDate = "2025-12-11" },
    @{ Number = 11; StartDate = "2025-12-11"; EndDate = "2025-12-18" },
    @{ Number = 12; StartDate = "2025-12-18"; EndDate = "2025-12-20" },
    @{ Number = 13; StartDate = "2025-12-20"; EndDate = "2025-12-22" },
    @{ Number = 14; StartDate = "2025-12-22"; EndDate = "2025-12-25" },
    @{ Number = 15; StartDate = "2025-12-25"; EndDate = "2025-12-26" }
)

Write-Host "=== GitHub Projects V2 설정 시작 ===" -ForegroundColor Green

# 1. 저장소 정보 조회
Write-Host "`n1. 저장소 정보 조회 중..." -ForegroundColor Yellow
$repoQuery = 'query { repository(owner: \"kingdom711\", name: \"studio\") { id owner { id } } }'

$repoResult = gh api graphql -f query=$repoQuery | ConvertFrom-Json
$repositoryId = $repoResult.data.repository.id
$ownerId = $repoResult.data.repository.owner.id

Write-Host "저장소 ID: $repositoryId" -ForegroundColor Cyan

# 2. 기존 프로젝트 조회
Write-Host "`n2. 기존 프로젝트 조회 중..." -ForegroundColor Yellow
$projectsQuery = 'query { repository(owner: \"kingdom711\", name: \"studio\") { projectsV2(first: 10) { nodes { id title number } } } }'

$projectsResult = gh api graphql -f query=$projectsQuery | ConvertFrom-Json
$existingProject = $projectsResult.data.repository.projectsV2.nodes | Where-Object { $_.title -eq $projectTitle } | Select-Object -First 1

if ($existingProject) {
    $projectId = $existingProject.id
    Write-Host "기존 프로젝트 발견: $projectId" -ForegroundColor Cyan
} else {
    # 3. 새 프로젝트 생성
    Write-Host "`n3. 새 프로젝트 생성 중..." -ForegroundColor Yellow
    $createProjectMutation = "mutation { createProjectV2(input: { ownerId: \`"$ownerId\`", title: \`"$projectTitle\`" }) { projectV2 { id number title } } }"
    
    $createResult = gh api graphql -f query=$createProjectMutation | ConvertFrom-Json
    $projectId = $createResult.data.createProjectV2.projectV2.id
    Write-Host "프로젝트 생성 완료: $projectId" -ForegroundColor Green
}

# 4. 프로젝트 필드 조회 (Start Date, Due Date 필드 찾기)
Write-Host "`n4. 프로젝트 필드 조회 중..." -ForegroundColor Yellow
$fieldsQuery = "query { node(id: \`"$projectId\`") { ... on ProjectV2 { fields(first: 20) { nodes { ... on ProjectV2Field { id name } ... on ProjectV2IterationField { id name } ... on ProjectV2SingleSelectField { id name } } } } } }"

$fieldsResult = gh api graphql -f query=$fieldsQuery | ConvertFrom-Json
$fields = $fieldsResult.data.node.fields.nodes

# Start Date와 Due Date 필드 찾기 또는 생성
$startDateField = $fields | Where-Object { $_.name -eq "Start date" -or $_.name -eq "Start Date" } | Select-Object -First 1
$dueDateField = $fields | Where-Object { $_.name -eq "Due date" -or $_.name -eq "Due Date" } | Select-Object -First 1

if (-not $startDateField) {
    Write-Host "Start Date 필드가 없습니다. GitHub Projects에서 수동으로 생성해주세요." -ForegroundColor Yellow
    Write-Host "프로젝트 설정 > Fields > Add field > Date > 'Start date' 이름으로 생성" -ForegroundColor Yellow
}

if (-not $dueDateField) {
    Write-Host "Due Date 필드가 없습니다. GitHub Projects에서 수동으로 생성해주세요." -ForegroundColor Yellow
    Write-Host "프로젝트 설정 > Fields > Add field > Date > 'Due date' 이름으로 생성" -ForegroundColor Yellow
}

# 5. 각 이슈를 프로젝트에 추가하고 날짜 설정
Write-Host "`n5. 이슈를 프로젝트에 추가하고 날짜 설정 중..." -ForegroundColor Yellow

foreach ($issue in $issues) {
    $issueNumber = $issue.Number
    $startDate = $issue.StartDate
    $endDate = $issue.EndDate
    
    Write-Host "`n이슈 #$issueNumber 처리 중..." -ForegroundColor Cyan
    
    # 이슈 ID 조회
    $issueQuery = "query { repository(owner: \`"kingdom711\`", name: \`"studio\`") { issue(number: $issueNumber) { id title } } }"
    
    $issueResult = gh api graphql -f query=$issueQuery | ConvertFrom-Json
    $issueId = $issueResult.data.repository.issue.id
    $issueTitle = $issueResult.data.repository.issue.title
    
    Write-Host "  이슈 ID: $issueId" -ForegroundColor Gray
    Write-Host "  제목: $issueTitle" -ForegroundColor Gray
    
    # 이슈를 프로젝트에 추가
    $addItemMutation = "mutation { addProjectV2ItemById(input: { projectId: \`"$projectId\`", contentId: \`"$issueId\`" }) { item { id } } }"
    
    try {
        $addResult = gh api graphql -f query=$addItemMutation | ConvertFrom-Json
        $itemId = $addResult.data.addProjectV2ItemById.item.id
        Write-Host "  프로젝트에 추가 완료: $itemId" -ForegroundColor Green
        
        # Start Date 필드 설정
        if ($startDateField) {
            $setStartDateMutation = "mutation { updateProjectV2ItemFieldValue(input: { projectId: \`"$projectId\`", itemId: \`"$itemId\`", fieldId: \`"$($startDateField.id)\`", value: { date: \`"$startDate\`" } }) { projectV2Item { id } } }"
            try {
                gh api graphql -f query=$setStartDateMutation | Out-Null
                Write-Host "  Start Date 설정: $startDate" -ForegroundColor Green
            } catch {
                Write-Host "  Start Date 설정 실패: $_" -ForegroundColor Red
            }
        }
        
        # Due Date 필드 설정
        if ($dueDateField) {
            $setDueDateMutation = "mutation { updateProjectV2ItemFieldValue(input: { projectId: \`"$projectId\`", itemId: \`"$itemId\`", fieldId: \`"$($dueDateField.id)\`", value: { date: \`"$endDate\`" } }) { projectV2Item { id } } }"
            try {
                gh api graphql -f query=$setDueDateMutation | Out-Null
                Write-Host "  Due Date 설정: $endDate" -ForegroundColor Green
            } catch {
                Write-Host "  Due Date 설정 실패: $_" -ForegroundColor Red
            }
        }
        
        Start-Sleep -Milliseconds 500  # Rate limit 방지
    } catch {
        Write-Host "  이미 프로젝트에 추가되어 있거나 오류 발생: $_" -ForegroundColor Yellow
    }
}

Write-Host "`n=== 완료 ===" -ForegroundColor Green
Write-Host "프로젝트 URL: https://github.com/orgs/kingdom711/projects" -ForegroundColor Cyan

