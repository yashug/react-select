import { useState } from "react";
import { Select, SelectOption } from "./Select";

const OPTIONS = [
  { label: "Education", value: 1, icon: <span>📚</span> },
  { label: "Science", value: 2, icon: <span>🔬</span> },
  { label: "Art", value: 3, icon: <span>🎨</span> },
  { label: "Sport", value: 4, icon: <span>⚽</span> },
  { label: "Games", value: 5, icon: <span>🎮</span> },
  { label: "Health", value: 6, icon: <span>🏥</span> },
];

function App() {
  const [options, setOptions] = useState<SelectOption[]>(OPTIONS);
  const [value1, setValue1] = useState<SelectOption[]>([]);
  const [value2, setValue2] = useState<SelectOption | undefined>(undefined);

  return (
    <>
      <Select
        multiple
        options={options}
        value={value1}
        onChange={(option) => setValue1(option)}
        onAddOption={(option) => setOptions([...options, option])}
      />
      <br />
      <Select options={options} value={value2} onChange={(o) => setValue2(o)} />
    </>
  );
}

export default App;
