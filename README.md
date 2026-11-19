# WONEY · 김지원 포트폴리오

GitHub Pages 공개용 정적 웹사이트입니다. 인터뷰, 커비 최종 상세페이지, 프로젝트 영상이 포함되어 있습니다.

## 무료 공개 방법

1. GitHub Free 계정에서 `woney-portfolio`라는 **공개(Public)** 저장소를 만듭니다.
2. 이 폴더의 파일을 그대로 저장소의 `main` 브랜치에 올립니다. `index.html`이 최상위에 있어야 합니다.
3. 저장소 **Settings → Pages → Build and deployment**로 이동합니다.
4. Source는 **Deploy from a branch**, Branch는 **main / (root)**로 선택하고 Save를 누릅니다.
5. 배포가 완료되면 Pages 설정에 표시되는 `https://계정명.github.io/woney-portfolio/` 주소를 공유합니다.

별도 도메인, GitHub Pro, 유료 호스팅이 필요하지 않습니다. 무료 플랜에서는 이 저장소와 웹사이트 파일이 공개됩니다. 방문자는 GitHub 계정 없이 사이트를 볼 수 있습니다.

파일이 많으므로 폴더 전체를 Git으로 올리는 방식을 권장합니다. ZIP 파일 자체를 저장소에 올려도 사이트가 배포되지는 않습니다.

## 수정할 곳

- `site-config.mjs`: 인터뷰 영상과 연락처
- `projects.mjs`: 작품 목록, 썸네일, 영상
- `case-studies.mjs`: 작품별 설명과 제작 과정
- `social-content.mjs`: SNS 계정과 대표 영상
- `style.css`: 디자인
- `assets/`: 이미지, 영상, 폰트

동영상을 교체할 때는 새 이름으로 저장하고 연결 경로를 수정하면 방문자의 브라우저 캐시와 충돌을 피할 수 있습니다.

## 확인된 원본

- 인터뷰: 2026-11-19 수정한 김지원 인터뷰 영상
- 커비 상세페이지: Figma `sGyoz6EYa9HeRFrAXWDK5I`, `721:171` 최종 상세페이지 프레임

Instagram·YouTube 삽입 영상은 해당 서비스의 로그인·재생 정책에 따라 제한될 수 있으며, 원본 링크를 함께 제공합니다.

## 운영 제한

GitHub Pages 공식 제한: https://docs.github.com/en/pages/getting-started-with-github-pages/github-pages-limits
사이트 최대 1GB, 월 트래픽 소프트 한도 100GB. 한도 초과가 유료 결제 동의는 아니며, 서비스 제한이나 운영 방식 조정이 필요할 수 있습니다.
