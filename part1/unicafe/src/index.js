import React, { useState } from "react";
import ReactDOM from "react-dom";

const Title = ({ title }) => <h1>{title}</h1>;
const Button = ({ onClick, text }) => (
  <button
    style={{ borderColor: "gray", borderRadius: "2px" }}
    onClick={onClick}
  >
    {text}
  </button>
);
const Statistics = ({ good, neutral, bad, total, average, positive }) => {
  if (total > 0) {
    return (
      <div>
        <Statistic text="good" value={good} />
        <Statistic text="neutral" value={neutral} />
        <Statistic text="bad" value={bad} />
        <Statistic text="all" value={total} />
        <Statistic text="average" value={average} />
        <Statistic text="positive" value={positive} percent="%" />
      </div>
    );
  }
  return <div>No feedback given</div>;
};
const Statistic = ({ text, value, percent }) => {
  return (
    <div>
      {text} {value} {percent}
    </div>
  );
};

const App = () => {
  // save clicks of each button to own state
  const [good, setGood] = useState(0);
  const [neutral, setNeutral] = useState(0);
  const [bad, setBad] = useState(0);

  const total = good + neutral + bad;
  const average = total > 0 ? (good - bad) / total : 0;
  const positive = total > 0 ? good * 100 / total : 0;

  const handleGoodClick = () => setGood(good + 1);
  const handleNeutralClick = () => setNeutral(neutral + 1);
  const handleBadClick = () => setBad(bad + 1);

  return (
    <div>
      <Title title="give feedback" />
      <Button text="good" onClick={handleGoodClick} />
      <Button text="neutral" onClick={handleNeutralClick} />
      <Button text="bad" onClick={handleBadClick} />
      <Title title="statistics" />
      <Statistics
        good={good}
        neutral={neutral}
        bad={bad}
        total={total}
        average={average}
        positive={positive}
      />
    </div>
  );
};

ReactDOM.render(<App />, document.getElementById("root"));
