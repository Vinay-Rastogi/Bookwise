import BookList from "@/components/BookList";
import React from "react";
import dummyBooks from "@/dummybooks.json";


const page = () => {
  return (
    <>
      <BookList title="Borrowed Books" books={dummyBooks} containerClassName="" />
    </>
  );
};

export default page;
