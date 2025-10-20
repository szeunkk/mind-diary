"use client";

import React, { useState } from "react";
import Image from "next/image";
import SelectBox from "@/commons/components/selectbox";
import styles from "./styles.module.css";

const filterOptions = [
  { value: "default", label: "기본" },
  { value: "newest", label: "최신순" },
  { value: "oldest", label: "오래된순" },
];

// Mock 데이터 생성
const mockPictures = Array.from({ length: 10 }, (_, index) => ({
  id: index + 1,
  src: "/images/dog-1.jpg",
  alt: `강아지 사진 ${index + 1}`,
}));

const PicturesComponent: React.FC = () => {
  const [selectedFilter, setSelectedFilter] = useState("default");

  const handleFilterChange = (value: string) => {
    setSelectedFilter(value);
  };

  return (
    <div className={styles.container}>
      <div className={styles.gap32}></div>
      <div className={styles.filter}>
        <SelectBox
          variant="primary"
          size="medium"
          theme="light"
          options={filterOptions}
          value={selectedFilter}
          onChange={handleFilterChange}
          className={styles.filterSelectBox}
        />
      </div>
      <div className={styles.gap42}></div>
      <div className={styles.main}>
        <div className={styles.pictureGrid}>
          {mockPictures.map((picture) => (
            <div key={picture.id} className={styles.pictureItem}>
              <Image
                src={picture.src}
                alt={picture.alt}
                width={640}
                height={640}
                className={styles.pictureImage}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PicturesComponent;
