import React, { useState } from "react";
import ReactDOM from "react-dom";

const Button = ({ onClick, text }) => <button onClick={onClick}>{text}</button>;
const Anecdote = ({ text, votes }) => (
  <div>
    {text}
    <br />
    has {votes} votes
  </div>
);
const Title = ({ text }) => <h1>{text}</h1>;

const App = ({ anecdotes }) => {
  const [selected, setSelected] = useState(0);
  const [votes, setVotes] = useState(anecdotes.map(anecdote => 0));

  const maxVotes = Math.max(...votes);
  const maxVotesIndex = votes.indexOf(maxVotes);
  const anecdoteWithMaxVotes = anecdotes[maxVotesIndex];

  const random = () => Math.floor(Math.random() * anecdotes.length);

  const handleNextAnecdoteClicked = () => {
    setSelected(random());
  };
  const handleVoteClicked = () => {
    const copy = [...votes];
    copy[selected] += 1;
    setVotes(copy);
  };

  return (
    <div>
      <Title text="Anecdote of the day" />
      <Anecdote text={anecdotes[selected]} votes={votes[selected]} />
      <Button text="vote" onClick={handleVoteClicked} />
      <Button text="next anecdote" onClick={handleNextAnecdoteClicked} />
      <Title text="Anecdote with most votes" />
      <Anecdote text={anecdoteWithMaxVotes} votes={maxVotes} />
    </div>
  );
};

const anecdotes = [
  "If it hurts, do it more often",
  "Adding manpower to a late software project makes it later!",
  "The first 90 percent of the code accounts for the first 90 percent of the development time...The remaining 10 percent of the code accounts for the other 90 percent of the development time.",
  "Any fool can write code that a computer can understand. Good programmers write code that humans can understand.",
  "Premature optimization is the root of all evil.",
  "Debugging is twice as hard as writing the code in the first place. Therefore, if you write the code as cleverly as possible, you are, by definition, not smart enough to debug it.",
];

ReactDOM.render(<App anecdotes={anecdotes} />, document.getElementById("root"));
