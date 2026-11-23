# Ju Young Jeong 홈페이지 — 2026-11-23 최종본 v2

사용자가 확정한 홈페이지입니다. GitHub에 직접 업로드할 수 있는 정적 사이트 전체 파일입니다.

## 업로드 방법

1. ju-young-jeong-website-final-20261123-v2.zip을 압축 해제합니다.
2. 현재 홈페이지 GitHub 저장소에서 기존 index.html이 있는 위치로 이동합니다.
3. Add file → Upload files를 선택합니다.
4. 압축을 푼 폴더 안의 내용물을 업로드합니다. 상위 폴더나 ZIP 자체를 올리지 않습니다.
5. images/와 vendor/는 폴더째 넣어 하위 경로를 유지합니다. .nojekyll도 포함합니다.
6. Update portfolio hero 2026-11-23 v2 등으로 커밋합니다. 새 브랜치에 올렸다면 PR을 통해 현재 Pages 배포 브랜치에 반영합니다.
7. Actions에서 Pages 배포가 성공하면 홈페이지를 열고 Ctrl+F5로 새로고침합니다.

기존 저장소의 CNAME, .github/ 워크플로, Pages 설정은 유지합니다. 기존 파일을 모두 삭제할 필요 없이 같은 경로에 덮어씁니다.

## 업로드 항목

- images/ 전체
- vendor/ 전체 — Three.js 및 라이선스
- .nojekyll
- index.html, highlights.html, forrheu.html, guided-waves.html
- style.css, story.css, forrheu.css, guided-waves.css
- script.js, morphology-world.js, morphology-motion.js
- README.md는 선택 사항입니다.

이번에는 story.css가 추가되었습니다. 빠뜨리지 말고 업로드합니다. 탐색기에서 확장자가 숨겨져 이름이 같게 보이더라도 HTML과 CSS를 모두 포함합니다.

## 확정 내용

- Shape → Architect → Sense를 9초씩 자동 재생하는 27초 루프
- 마지막 장면에서 첫 장면으로 직접 이어지는 전환
- 단계 버튼을 터치·클릭하면 그 지점에서 루프가 이어짐
- Pause motion, 동작 줄이기 설정, 화면 밖/비활성 탭에서 재생 정지
- 한 화면 높이의 히어로, 장면 전환과 독립적인 일반 스크롤
- Morphogenetic Manufacturing 제목과 반도체 재료의 형상 제조 설명
- Architect 장면에서 압전 디바이스 제외
- Sense the unseen. 및 Toward advanced MEMS/NEMS sensor technologies 문구
- 진한 네이비 배경, 안내 문구 삭제

기존 연구 상세 페이지, Research 이하 내용, 로고 및 승인된 재료·레이저·열 변화 표현을 포함합니다.

## 확인 내역

HTML 구조, 내부 파일/앵커, CSS 구조, 네 가지 화면 크기의 3D 배치 및 유한 변환값, 전체 루프와 마지막-첫 장면 연결, 버튼 선택 시 스크롤 방지, 일시정지, 동작 줄이기, 화면 밖/비활성 탭 정지, WebGL 실패 처리, ZIP 내용 및 파일 해시를 검증했습니다.
레이아웃은 사용자가 미리보기로 검토하고 확정했습니다. 자동화 검증은 실제 Three.js 모델과 렌더러 모의 환경을 사용했으며, 자동 브라우저/GPU 렌더링 검증은 수행하지 못했습니다.

GitHub 업로드는 사용자가 직접 진행합니다. 이전 최종본과 ZIP은 별도로 보존되어 있습니다.

공식 안내: https://docs.github.com/en/repositories/working-with-files/managing-files/adding-a-file-to-a-repository
