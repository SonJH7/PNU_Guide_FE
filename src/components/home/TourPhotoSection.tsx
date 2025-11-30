import React, { useEffect, useRef, useState } from 'react';
import styled from 'styled-components';

import tourHaeundae from '@/assets/images/tour-haeundae-20251001.jpg';
import tourHyewon from '@/assets/images/tour-hyewon-20250930.jpg';
import { typographyMixin } from '@/theme/theme';

const ScrollRow = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing(2)};
  overflow-x: auto;
  padding: ${({ theme }) => theme.spacing(0)} ${({ theme }) => theme.spacing(0)}
    ${({ theme }) => theme.spacing(1.5)};
  margin: 0 0 ${({ theme }) => theme.spacing(1.5)};
  background-color: transparent;
  border-radius: 0;
  scroll-snap-type: x mandatory;
  -webkit-overflow-scrolling: touch;

  &::-webkit-scrollbar {
    height: 0;
  }

  scrollbar-width: none;
`;

const PhotoCard = styled.article`
  flex: 0 0 76%;
  max-width: 76%;
  background-color: ${({ theme }) => theme.palette.surface.card};
  border-radius: ${({ theme }) => theme.shape.borderRadiusMd};
  overflow: hidden;
  box-shadow: none;
  scroll-snap-align: start;

  @media (min-width: ${({ theme }) => theme.breakpoints.tablet}) {
    flex-basis: 58%;
    max-width: 58%;
  }
`;

const PhotoThumb = styled.div`
  width: 100%;
  padding-top: 62%;
  position: relative;
  overflow: hidden;

  img {
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
    object-fit: cover;
    transform: scale(1.02);
  }
`;

const PhotoBody = styled.div`
  padding: ${({ theme }) => theme.spacing(1.5)}
    ${({ theme }) => theme.spacing(1.75)} ${({ theme }) => theme.spacing(1.75)};
`;

const PhotoTitle = styled.h3`
  ${typographyMixin('body1')};
  margin: 0 0 ${({ theme }) => theme.spacing(0.5)};
  color: ${({ theme }) => theme.palette.text.primary};
`;

const PhotoDate = styled.p`
  ${typographyMixin('caption')};
  margin: 0;
  color: ${({ theme }) => theme.palette.text.secondary};
`;

const Sentinel = styled.div`
  flex: 0 0 36px;
  height: 1px;
`;

const EmptyState = styled.p`
  ${typographyMixin('body2')};
  color: ${({ theme }) => theme.palette.text.disabled};
`;

type TourPhoto = {
  id: number;
  title: string;
  date: string;
  image: string;
};

const initialPhotos: TourPhoto[] = [
  {
    id: 1,
    title: '해운대여자고등학교 1학년',
    date: '2025. 10. 1.',
    image: tourHaeundae,
  },
  {
    id: 2,
    title: '부산혜원학교 방문단',
    date: '2025. 09. 30.',
    image: tourHyewon,
  },
];

const mockMorePhotos = (page: number): TourPhoto[] =>
  Array.from({ length: 4 }).map((_, idx) => {
    const id = page * 10 + idx;
    return {
      id,
      title: `부산대 캠퍼스 투어 ${id}팀`,
      date: `2025. 09.${String(10 + id).padStart(2, '0')}.`,
      image: idx % 2 === 0 ? tourHaeundae : tourHyewon,
    };
  });

const TourPhotoSection: React.FC = () => {
  const [photos, setPhotos] = useState<TourPhoto[]>(initialPhotos);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const sentinelRef = useRef<HTMLDivElement | null>(null);
  const isLoadingRef = useRef(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (!hasMore) return undefined;
    if (typeof IntersectionObserver === 'undefined') return undefined;

    const observer = new IntersectionObserver(
      (entries) => {
        const target = entries[0];
        if (target.isIntersecting && !isLoadingRef.current) {
          isLoadingRef.current = true;

          timeoutRef.current = setTimeout(() => {
            const nextPage = page + 1;
            const newItems = mockMorePhotos(nextPage);

            setPhotos((prev) => [...prev, ...newItems]);
            setPage(nextPage);

            if (nextPage >= 3) {
              setHasMore(false);
            }

            isLoadingRef.current = false;
          }, 600);
        }
      },
      {
        rootMargin: '0px 140px',
        threshold: 0.15,
      },
    );

    const sentinel = sentinelRef.current;
    if (sentinel) {
      observer.observe(sentinel);
    }

    return () => {
      if (sentinel) {
        observer.unobserve(sentinel);
      }
      observer.disconnect();
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [page, hasMore]);

  if (!photos.length) {
    return <EmptyState>아직 등록된 투어 사진이 없습니다.</EmptyState>;
  }

  return (
    <ScrollRow aria-label="투어 사진 리스트">
      {photos.map((photo) => (
        <PhotoCard key={photo.id}>
          <PhotoThumb>
            <img src={photo.image} alt={`${photo.title} 투어 사진`} />
          </PhotoThumb>
          <PhotoBody>
            <PhotoTitle>{photo.title}</PhotoTitle>
            <PhotoDate>{photo.date}</PhotoDate>
          </PhotoBody>
        </PhotoCard>
      ))}
      {hasMore && <Sentinel ref={sentinelRef} aria-hidden="true" />}
    </ScrollRow>
  );
};

export default TourPhotoSection;
