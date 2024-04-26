import {
  ChangeEventHandler,
  MouseEventHandler,
  ReactEventHandler,
  useEffect,
  useState,
} from "react";
import "./App.css";

const qwertyKeyboard: string[][] = [
  ["`", "1", "2", "3", "4", "5", "6", "7", "8", "9", "0", "-", "="],
  ["q", "w", "e", "r", "t", "y", "u", "i", "o", "p", "[", "]", "\\"],
  ["a", "s", "d", "f", "g", "h", "j", "k", "l", ";", "'"],
  ["z", "x", "c", "v", "b", "n", "m", ",", ".", "/"],
];

const getRow = (key: string): number => {
  for (let i = 0; i < qwertyKeyboard.length; i++) {
    if (qwertyKeyboard[i].find((el) => el === key)) {
      return i;
    }
  }
  return -1;
};

const getBetween = (from: string, to: string): string[] => {
  const toRow = getRow(to),
    fromRow = getRow(from);
  if (fromRow === -1 || toRow === -1) {
    console.error(
      `Invalid keys: from:${from} or to:${to} which is not in the QWERTY keyboard`,
    );
    return [];
  }
  if (fromRow !== toRow) {
    console.error(
      `Two keys must be in the same row. Got from row: ${fromRow} != to row: ${toRow}. This might be a bug`,
    );
    return [];
  }
  const rowKeys = qwertyKeyboard[fromRow];
  const fromRowIndex = rowKeys.findIndex((el) => el === from);
  const toRowIndex = rowKeys.findIndex((el) => el === to);
  return rowKeys.filter((_, i) => i > fromRowIndex && i < toRowIndex);
};

const getFromOptions = (): string[] => {
  return qwertyKeyboard.flat();
};

const getToOptions = (from: string | undefined): string[] => {
  if (from === undefined) {
    return qwertyKeyboard.flat();
  }
  const rowIndex = getRow(from);
  const fromIndex = qwertyKeyboard[rowIndex].findIndex((el) => el === from);
  return qwertyKeyboard[rowIndex].slice(fromIndex + 1);
};

interface BetweenChoice {
  from: string | undefined;
  to: string | undefined;
}

function App() {
  const [betweenChoices, setBetweenChoices] = useState<BetweenChoice[]>([
    { from: undefined, to: undefined },
  ]);
  const [value, setValue] = useState("");

  const onSelectFrom =
    (keysIndex: number): ChangeEventHandler<HTMLSelectElement> =>
    (e) => {
      setBetweenChoices((prev) => {
        const newChoices = [...prev];
        newChoices[keysIndex].from = e.target.value;
        return newChoices;
      });
    };

  const onSelectTo =
    (keysIndex: number): ChangeEventHandler<HTMLSelectElement> =>
    (e) => {
      setBetweenChoices((prev) => {
        const newChoices = [...prev];
        newChoices[keysIndex].to = e.target.value;
        return newChoices;
      });
    };

  const onClickAdd: MouseEventHandler<HTMLButtonElement> = () => {
    setBetweenChoices((prev) => [...prev, { from: undefined, to: undefined }]);
  };

  useEffect(() => {
    const values = betweenChoices
      .filter((el) => el.from !== undefined && el.to !== undefined)
      .map((el) => getBetween(el.from!, el.to!))
      .flat()
      .reduce((prev, acc) => {
        return prev + acc;
      }, "");
    setValue(values);
  }, [betweenChoices]);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 1 }}>
      <div style={{ display: "flex", flexDirection: "column" }}>
        {betweenChoices.map((choice, i) => {
          return (
            <p key={`key-${i}`} style={{ lineHeight: 0 }}>
              <span>Look between your </span>
              <select
                key={`from-key-${i}-${choice.from}`}
                value={choice.from}
                onChange={onSelectFrom(i)}
              >
                {getFromOptions().map((opt) => {
                  return <option value={opt}>{opt}</option>;
                })}
              </select>
              <span>and </span>
              <select
                key={`to-key-${i}-${choice.to}`}
                value={choice.to}
                onChange={onSelectTo(i)}
              >
                {getToOptions(choice.from).map((opt) => {
                  return <option value={opt}>{opt}</option>;
                })}
              </select>
            </p>
          );
        })}
      </div>
      <button onClick={onClickAdd} style={{ width: "fit-content" }}>
        + Add
      </button>
      <p>Result: </p>
      <textarea readOnly value={value} />
    </div>
  );
}

export default App;
