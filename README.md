# Ju Young Jeong 개인 홈페이지 — 최종본 v3

확정일: 2026-11-22 (Asia/Seoul)
이번 배포 폴더: ju-young-jeong-website-final-20261122-v3
이전 v2 대신 이번 v3의 내용물을 업로드합니다.

## GitHub에 업로드할 항목

압축을 풀어 나온 폴더 안의 내용물 전체를 올립니다.
ZIP 파일이나 ju-young-jeong-website-final-20261122-v3라는 상위 폴더 자체를 올리지 않습니다.
기존 index.html과 같은 위치에 새 index.html이 있어야 합니다.

- images/ 폴더 전체
- vendor/ 폴더 전체 (Three.js와 MIT 라이선스 포함, 반드시 함께 업로드)
- .nojekyll
- index.html
- highlights.html
- forrheu.html / forrheu.css
- guided-waves.html / guided-waves.css
- style.css / script.js
- morphology-world.js / morphology-motion.js
- README.md (안내 문서이므로 선택 사항)

Windows에서 .nojekyll이 보이지 않으면 탐색기에서 숨긴 항목 표시를 켜거나 ZIP의 파일 목록을 확인합니다.
파일 확장자가 숨겨져 있어 같은 이름으로 보이는 HTML과 CSS도 모두 업로드합니다.

## GitHub 웹사이트에서 업데이트

1. ZIP을 압축 해제합니다.
2. 현재 홈페이지를 배포하는 GitHub 저장소를 엽니다.
3. 기존 index.html이 있는 폴더로 이동합니다. 현재 배포가 루트라면 저장소 첫 화면, /docs 배포라면 docs 안입니다.
4. Add file → Upload files를 선택합니다.
5. 압축 해제한 폴더의 내용물 전체(images/, vendor/, HTML·CSS·JS, .nojekyll)를 업로드 영역으로 드래그합니다. 하위 폴더의 상대 경로가 유지되도록 폴더째 넣습니다.
6. 커밋 메시지는 Update portfolio to final v3 등으로 입력합니다. 현재 Pages 배포에 쓰는 브랜치에 반영합니다. 새 브랜치를 선택했다면 Pull Request를 만든 뒤 배포 브랜치에 merge해야 반영됩니다.
7. 저장소 Actions 탭에서 Pages 배포 작업이 성공했는지 확인합니다.
8. 홈페이지를 열어 Ctrl+F5 또는 브라우저 새로고침을 합니다. 모바일에서도 새로고침 후 확인합니다.

이미 운영 중인 사이트의 Pages 설정, CNAME, .github/ 워크플로는 그대로 유지합니다.
기존 파일을 전부 지울 필요 없이 같은 경로의 파일을 덮어씁니다.

GitHub 웹 업로드는 한 번에 100개 파일, 파일당 25 MiB까지 지원합니다. 이번 묶음은 이 범위 안에 있습니다.
안내: https://docs.github.com/en/repositories/working-with-files/managing-files/adding-a-file-to-a-repository
Pages: https://docs.github.com/en/pages/getting-started-with-github-pages/configuring-a-publishing-source-for-your-github-pages-site

## 이번 최종본에 포함된 내용

- 모든 페이지에 적층 멤브레인 심볼 + 기존 폰트·크기의 JYJ 로고 적용.
- 실리콘 형상 변화가 중심인 실제 3D 모션, 유연 압전 구조·초음파·시료 부착 공진기 장면.
- 좌상단 구조는 우상단보다 조금 더 매트한 실리콘 표면.
- 우상단 레이저는 현재 두께를 유지한 단색 빨강·초록. 모션에 맞춰 켜졌다 사라짐.
- 중앙 구조는 공동이 멤브레인으로 병합될수록 가열되고, 반대 모션에서 냉각되는 효과.
- 모바일에서는 그림을 소개글 쪽으로 올리고 글자 뒤에만 밝은 배경 적용. PC 그림 배치 유지.
- 로딩 전에 표시되던 이전 정지 이미지를 제거. 로딩 중·WebGL 미지원 시 사이트 배경색만 표시.
- ForRheU 문구: From technology to patient-centered use.
- 기존 ForRheU와 guided-wave 연구 상세 페이지 및 홍보·수상·논문 콘텐츠 포함.

## 실행 및 검사

설치나 빌드 과정 없이 index.html을 열어 확인할 수 있습니다. GitHub Pages에서는 같은 파일을 그대로 서비스합니다.
Three.js와 라이선스는 vendor/ 안에 있어 별도 CDN 없이 동작합니다.
모션 일시정지/재개, reduced motion, 화면 밖·비활성 탭에서 정지, WebGL 오류 시 빈 배경으로 전환하는 동작을 포함합니다.

HTML 구조·로컬 파일·내부 링크·이미지, 3D 형상/효과의 모션 연동과 모션 제어 검사를 수행했습니다.
브라우저 자동 시각 검증은 로컬 파일 접근 정책으로 제한되었습니다. 기기별 실제 화면은 배포 후 확인합니다.
모션은 개념적 연구 일러스트이며 실측 데이터나 공정 시뮬레이션은 아닙니다.

GitHub 업로드와 배포는 사용자가 진행합니다.
