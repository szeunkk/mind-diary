/**
 * Emotion Enum Constants
 * 감정(emotion) enum 데이터와 메타데이터를 정의합니다.
 */

import { red, blue, gray, yellow, green } from "./color";

// Emotion Enum
export enum Emotion {
  Happy = "HAPPY",
  Sad = "SAD",
  Angry = "ANGRY",
  Surprise = "SURPRISE",
  Etc = "ETC",
}

// Emotion 이미지 사이즈
export enum EmotionImageSize {
  Medium = "m",
  Small = "s",
}

// Emotion 메타데이터 타입
export interface EmotionMetadata {
  label: string;
  imageMedium: string;
  imageSmall: string;
  color: string;
}

// Emotion 메타데이터 맵
// Note: SVG는 icons 폴더에 m 사이즈만 존재, PNG는 images 폴더에 m/s 사이즈 모두 존재
export const emotionMetadata: Record<Emotion, EmotionMetadata> = {
  [Emotion.Happy]: {
    label: "행복해요",
    imageMedium: "/images/emotion-happy-m.png",
    imageSmall: "/images/emotion-happy-s.png",
    color: red[60],
  },
  [Emotion.Sad]: {
    label: "슬퍼요",
    imageMedium: "/images/emotion-sad-m.png",
    imageSmall: "/images/emotion-sad-s.png",
    color: blue[60],
  },
  [Emotion.Angry]: {
    label: "화나요",
    imageMedium: "/images/emotion-angry-m.png",
    imageSmall: "/images/emotion-angry-s.png",
    color: gray[60],
  },
  [Emotion.Surprise]: {
    label: "놀랐어요",
    imageMedium: "/images/emotion-surprise-m.png",
    imageSmall: "/images/emotion-surprise-s.png",
    color: yellow[60],
  },
  [Emotion.Etc]: {
    label: "기타",
    imageMedium: "/images/emotion-etc-m.png",
    imageSmall: "/images/emotion-etc-s.png",
    color: green[60],
  },
};

// Helper 함수들
export const getEmotionLabel = (emotion: Emotion): string => {
  return emotionMetadata[emotion].label;
};

export const getEmotionImage = (
  emotion: Emotion,
  size: EmotionImageSize = EmotionImageSize.Medium
): string => {
  return size === EmotionImageSize.Medium
    ? emotionMetadata[emotion].imageMedium
    : emotionMetadata[emotion].imageSmall;
};

export const getEmotionColor = (emotion: Emotion): string => {
  return emotionMetadata[emotion].color;
};

// 모든 감정 타입 배열
export const allEmotions: Emotion[] = [
  Emotion.Happy,
  Emotion.Sad,
  Emotion.Angry,
  Emotion.Surprise,
  Emotion.Etc,
];
