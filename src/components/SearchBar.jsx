import React, { useRef, useState } from "react";
import TaskList from "./TaskList";

function SearchBar() {
  const [query, setQuery] = useState("");
  const searchInput = useRef(null);

  function handleSearch(e) {
    setQuery(searchInput.current.value);
  }


  return (
    <div>
      <input
        type="text"
        placeholder="Search tasks..."
        value={query}
        ref={searchInput}
        onChange={handleSearch}
      />
      <TaskList query={query}/>
    </div>
  );
}

export default SearchBar;
