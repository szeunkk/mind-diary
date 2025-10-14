"use client";

import React, { useState } from "react";
import Image from "next/image";
import SelectBox from "@/commons/components/selectbox";
import SearchBar from "@/commons/components/searchbar";
import Button from "@/commons/components/button";
import styles from "./styles.module.css";

const DiariesComponent: React.FC = () => {
  const [selectedFilter, setSelectedFilter] = useState("all");

  const filterOptions = [
    { value: "all", label: "전체" },
    { value: "happy", label: "기쁨" },
    { value: "sad", label: "슬픔" },
    { value: "angry", label: "화남" },
    { value: "surprise", label: "놀람" },
    { value: "etc", label: "기타" },
  ];

  const handleFilterChange = (value: string) => {
    setSelectedFilter(value);
  };

  const handleSearch = (value: string) => {
    // 검색 로직 구현
    console.log("검색어:", value);
  };

  const handleWriteDiary = () => {
    // 일기쓰기 페이지로 이동
    console.log("일기쓰기 클릭");
  };

  return (
    <div className={styles.container}>
      <div className={styles.gap32}></div>
      <div className={styles.search}>
        <div className={styles.searchLeft}>
          <SelectBox
            variant="primary"
            size="medium"
            theme="light"
            options={filterOptions}
            value={selectedFilter}
            onChange={handleFilterChange}
            placeholder="전체"
            className={styles.filterSelect}
          />
          <SearchBar
            variant="primary"
            size="medium"
            theme="light"
            placeholder="검색어를 입력해 주세요."
            onSearch={handleSearch}
            className={styles.searchInput}
          />
        </div>
        <div className={styles.searchRight}>
          <Button
            variant="primary"
            size="medium"
            theme="light"
            onClick={handleWriteDiary}
            className={styles.writeButton}
            icon={
              <Image
                src="/icons/plus_outline_light_m.svg"
                alt="plus"
                width={24}
                height={24}
              />
            }
          >
            일기쓰기
          </Button>
        </div>
      </div>
      <div className={styles.gap42}></div>
      <div className={styles.main}></div>
      <div className={styles.gap40}></div>
      <div className={styles.pagination}></div>
      <div className={styles.gap40}></div>
    </div>
  );
};

export default DiariesComponent;
