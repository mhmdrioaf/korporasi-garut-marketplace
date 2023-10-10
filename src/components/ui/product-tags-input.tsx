"use client";

import { TProductContextType } from "@/lib/hooks/context/productContextType";
import { ProductContext } from "@/lib/hooks/context/useProductContext";
import { useContext, useState } from "react";
import { Button } from "./button";
import { PlusIcon, XIcon } from "lucide-react";

export default function ProductTagsInput() {
  const [tagInput, setTagInput] = useState<string>("");
  const [isKeyReleased, setIsKeyReleased] = useState<boolean>(false);

  const { tags, setTags } = useContext(ProductContext) as TProductContextType;

  const onTagInputChangeHandler = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { value } = event.target;
    setTagInput(value);
  };

  const addTag = () => {
    if (tagInput.length && !tags.includes(tagInput)) {
      setTags((prev) => [...prev, tagInput]);
    }
  };

  const onTagInputKeyDownHandler = (
    event: React.KeyboardEvent<HTMLInputElement>
  ) => {
    const { key } = event;
    const trimmedTag = tagInput.trim();

    if (key === "," && trimmedTag.length && !tags.includes(trimmedTag)) {
      event.preventDefault();
      setTags((prev) => [...prev, trimmedTag]);
      setTagInput("");
    }

    if (
      key === "Backspace" &&
      !tagInput.length &&
      tags.length &&
      isKeyReleased
    ) {
      const _tags = [...tags];
      const updatedTag = _tags.pop();
      event.preventDefault();
      setTags(_tags);
      setTagInput(updatedTag ?? "");
    }

    setIsKeyReleased(false);
  };

  const onTagInputKeyUpHandler = () => {
    setIsKeyReleased(true);
  };

  const onTagDeleteHandler = (tag: string) => {
    const updatedTags = tags.filter((currentTag) => currentTag !== tag);
    setTags(updatedTags);
  };

  return (
    <div className="w-full px-4 py-2 rounded-sm overflow-hidden border border-input flex flex-row items-center gap-2">
      {tags.length > 0 &&
        tags.map((tag) => (
          <div className="flex flex-row items-center gap-1" key={tag}>
            <p className="font-bold text-sm">{tag}</p>
            <Button
              variant="ghost"
              size="icon"
              type="button"
              onClick={() => onTagDeleteHandler(tag)}
            >
              <XIcon className="w-4 h-4" />
            </Button>
          </div>
        ))}
      <div className="flex flex-row items-center gap-1">
        <input
          className="outline-none"
          placeholder="Kata kunci..."
          value={tagInput}
          onChange={onTagInputChangeHandler}
          onKeyDown={onTagInputKeyDownHandler}
          onKeyUp={onTagInputKeyUpHandler}
        />
        <Button
          variant="default"
          onClick={() => addTag()}
          type="button"
          size="icon"
        >
          <PlusIcon className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
}
