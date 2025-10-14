import React from "react";
import DiariesDetailComponent from "@/components/diaries-detail";

interface DiaryDetailPageProps {
  params: {
    id: string;
  };
}

const DiaryDetailPage: React.FC<DiaryDetailPageProps> = ({ params }) => {
  // TODO: params.id를 사용하여 특정 일기 데이터를 가져올 예정
  console.log("Diary ID:", params.id);

  return (
    <div>
      <DiariesDetailComponent />
    </div>
  );
};

export default DiaryDetailPage;
