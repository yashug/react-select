import React, { useEffect, useRef, useState } from "react";
import "./select.scss";

export type SelectOption = {
  label: string;
  value: string | number;
  icon?: React.ReactNode;
};

type MultipleSelectProps = {
  multiple: true;
  value: SelectOption[];
  onChange: (value: SelectOption[]) => void;
};

type SingleSelectProps = {
  multiple?: false;
  value?: SelectOption;
  onChange: (value: SelectOption | undefined) => void;
};

type SelectProps = {
  options: SelectOption[];
  onAddOption?: (option: SelectOption) => void;
} & (SingleSelectProps | MultipleSelectProps);

export function Select({
  multiple,
  value,
  onChange,
  options,
  onAddOption,
}: SelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(0);
  const [inputValue, setInputValue] = useState("");
  const containerRef = useRef<HTMLDivElement>(null);

  // Clears all selected options
  function clearOptions() {
    multiple ? onChange([]) : onChange(undefined);
  }

  // Handles option selection
  function selectOption(option: SelectOption) {
    if (multiple) {
      if (value.includes(option)) {
        onChange(value.filter((o) => o !== option));
      } else {
        onChange([...value, option]);
      }
    } else {
      if (option !== value) onChange(option);
    }
  }

  // Checks if an option is selected
  function isOptionSelected(option: SelectOption) {
    return multiple ? value.includes(option) : option === value;
  }

  // Adds a new option to the list
  function addOption() {
    const newOption = { label: inputValue, value: options.length + 1 };
    if (
      options.some(
        (o) => o.label.toLowerCase() === newOption.label.toLowerCase()
      )
    )
      return;
    onAddOption?.(newOption);
    selectOption(newOption);
    !multiple && setIsOpen(false);
    setInputValue("");
  }

  // Sets the first option as highlighted when the dropdown is opened
  useEffect(() => {
    if (isOpen) setHighlightedIndex(0);
  }, [isOpen]);

  // Handles clicks outside the dropdown to close it
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      const target = event.target as Node;
      if (containerRef.current && !containerRef.current.contains(target)) {
        setIsOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Handles keyboard navigation within the dropdown
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.target != containerRef.current) return;
      switch (e.code) {
        case "Enter":
        case "Space":
          setIsOpen((prev) => !prev);
          if (isOpen) selectOption(options[highlightedIndex]);
          break;
        case "ArrowUp":
        case "ArrowDown": {
          if (!isOpen) {
            setIsOpen(true);
            break;
          }

          const newValue = highlightedIndex + (e.code === "ArrowDown" ? 1 : -1);
          if (newValue >= 0 && newValue < options.length) {
            setHighlightedIndex(newValue);
          }
          break;
        }
        case "Escape":
          setIsOpen(false);
          break;
      }
    };
    containerRef.current?.addEventListener("keydown", handler);

    return () => {
      containerRef.current?.removeEventListener("keydown", handler);
    };
  }, [isOpen, highlightedIndex, options]);

  return (
    <div
      ref={containerRef}
      onClick={() => setIsOpen((prev) => !prev)}
      tabIndex={0}
      className="container"
    >
      <span className="value">
        {multiple
          ? value.map((v) => (
              <button
                key={v.value}
                onClick={(e) => {
                  e.stopPropagation();
                  selectOption(v);
                }}
                className="option-badge"
              >
                {v.label}
                <span className="remove-btn">&times;</span>
              </button>
            ))
          : value?.label}
      </span>
      <button
        onClick={(e) => {
          e.stopPropagation();
          clearOptions();
        }}
        className="clear-btn"
      >
        &times;
      </button>
      <div className="divider"></div>
      <div className="caret"></div>
      <ul className={`options ${isOpen ? "show" : ""}`}>
        {onAddOption && (
          <input
            type="text"
            value={inputValue}
            className="option-input"
            onChange={(e) => setInputValue(e.target.value)}
            onClick={(e) => e.stopPropagation()}
            onKeyDown={(e) => {
              if (e.key === "Enter" && inputValue.trim() !== "") {
                addOption();
              }
            }}
            placeholder="Add New and Enter..."
          />
        )}
        {options.map((option, index) => (
          <li
            onClick={(e) => {
              e.stopPropagation();
              selectOption(option);
              !multiple && setIsOpen(false);
            }}
            onMouseEnter={() => setHighlightedIndex(index)}
            key={option.value}
            className={`option ${isOptionSelected(option) ? "selected" : ""} ${
              index === highlightedIndex ? "highlighted" : ""
            }`}
          >
            {option.label}
            {option.icon}
          </li>
        ))}
      </ul>
    </div>
  );
}
