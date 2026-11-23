# Ju Young Jeong 개인 홈페이지 — 2026-11-23 최종본

확정일: 2026-11-23 (Asia/Seoul)
배포 폴더: ju-young-jeong-website-final-20261123
이전 최종본 대신 이번 폴더의 내용물 전체를 업로드합니다.

## GitHub 업로드 항목

ZIP을 압축 해제하고, 폴더 안의 내용물을 기존 index.html과 같은 위치에 올립니다.
ZIP 자체나 ju-young-jeong-website-final-20261123라는 상위 폴더를 업로드하지 않습니다.

- images/ 폴더 전체 (새 도식 SVG 4개 포함)
- vendor/ 폴더 전체 (Three.js 및 MIT 라이선스)
- .nojekyll
- index.html / highlights.html / forrheu.html / guided-waves.html
- style.css / forrheu.css / guided-waves.css
- script.js / morphology-world.js / morphology-motion.js
- README.md (안내 문서이므로 선택 사항)

탐색기에서 확장자가 숨겨져 같은 이름으로 보이더라도 HTML과 CSS를 모두 포함합니다.
.nojekyll도 함께 업로드합니다.

## GitHub 업데이트 순서

1. ZIP을 압축 해제합니다.
2. 현재 홈페이지를 배포하는 GitHub 저장소에서 기존 index.html이 있는 위치로 이동합니다.
3. Add file → Upload files를 선택합니다.
4. 압축 해제한 폴더의 내용물 전체를 업로드 영역으로 드래그합니다. images/와 vendor/는 하위 경로가 유지되도록 폴더째 넣습니다.
5. 커밋 메시지는 Update portfolio 2026-11-23 등으로 입력하고 현재 Pages 배포 브랜치에 반영합니다. 새 브랜치를 선택했다면 Pull Request를 만든 뒤 배포 브랜치에 merge합니다.
6. Actions에서 Pages 배포 성공을 확인한 뒤 홈페이지를 새로고침합니다. PC에서는 Ctrl+F5로 캐시를 새로 불러올 수 있습니다.

기존 Pages 설정, CNAME 및 .github/ 워크플로는 유지합니다.
기존 파일을 전부 지우지 않고, 같은 경로에 파일을 덮어쓰면 됩니다.
이미지와 새 SVG 도식을 빠뜨리지 않도록 전체 묶음을 업로드합니다.

공식 안내:
https://docs.github.com/en/repositories/working-with-files/managing-files/adding-a-file-to-a-repository
https://docs.github.com/en/pages/getting-started-with-github-pages/configuring-a-publishing-source-for-your-github-pages-site

## 이번에 확정된 수정

- 공학적 문제 정의 영역을 문제 → 요구 파동장 → 공학적 응답의 세 단계로 분리하고 핵심 문구 강조.
- Torsional 및 Conformal 연구의 Problem/Solution에 개념 도식 총 4개 추가, 설명 축약.
- 영상 제목을 See the mechanism in the video.로 변경.
- Watch on YouTube 링크는 영상 썸네일 아래 한 곳에 배치.
- Fabricated source 섹션 제거.
- NDT application: Nuclear fuel-rod inspection.로 표기 수정.
- 기여 내용 첫 단계를 소직경 봉 검사 한계 정의와 conformal 3D-printing 적용으로 수정.
- 논문 링크 문구를 Read the paper로 통일.
- ForRheU 논문 제목은 파란 박스로 강조하고 저널·IF는 작은 메타정보로 정리.

기존 홈페이지 3D 모션, 단색 빨강·초록 레이저, 가열/냉각 효과, 모바일 소개글 중첩 배치,
JYJ 적층 심볼 로고와 다른 확정 콘텐츠도 함께 포함합니다.
도식은 정성적 개념 그림이며 실측 파동장이나 신호 그래프가 아닙니다.

## 실행 및 검사

별도 설치나 빌드 없이 index.html을 열어 확인할 수 있습니다.
Three.js와 라이선스는 vendor/에 포함되어 있습니다.
4개 페이지의 HTML·내부 링크·로컬 리소스·이미지·SVG·CSS와 ZIP 무결성을 검사했습니다.
자동 브라우저 시각 검증은 로컬 파일 접근 정책으로 제한되었습니다.
파일별 SHA-256 및 검사 결과는 ZIP 옆의 manifest.json에 기록했습니다.

GitHub 업로드·배포는 사용자가 진행합니다.
