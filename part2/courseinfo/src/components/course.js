import React from "react";

const Header = ({ text }) => <h1>{text}</h1>;

const Part = ({ name, exercises }) => (
  <p>
    {name} {exercises}
  </p>
);

const Content = ({ parts }) => {
  return (
    <>
      {parts.map(part => (
        <Part key={part.id} name={part.name} exercises={part.exercises} />
      ))}
    </>
  );
};
const Total = ({ parts }) => {
  const total = parts.reduce((acc, obj) => acc + obj.exercises, 0);
  return <strong>total of {total} exercises</strong>;
};

const Course = ({ course }) => {
  return (
    <div>
      <Header text={course.name} />
      <Content parts={course.parts} />
      <Total parts={course.parts} />
    </div>
  );
};
export default Course;
