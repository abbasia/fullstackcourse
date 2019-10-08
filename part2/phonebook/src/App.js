import React, { useState, useEffect } from "react";
import personService from "./services/persons";
import "./App.css";
const Filter = ({ searchString, onChange }) => {
  return (
    <div>
      filter shown with <input value={searchString} onChange={onChange} />
    </div>
  );
};
const PersonForm = ({
  addPerson,
  newName,
  newNumber,
  onNameChange,
  onNumberChange
}) => {
  return (
    <form onSubmit={addPerson}>
      <div>
        name: <input value={newName} onChange={onNameChange} />
      </div>
      <div>
        number: <input value={newNumber} onChange={onNumberChange} />
      </div>
      <div>
        <button type="submit">add</button>
      </div>
    </form>
  );
};
const App = () => {
  const [persons, setPersons] = useState([]);
  const [filtered, setFiltered] = useState([]);

  const [newName, setNewName] = useState("");
  const [newNumber, setNewNumber] = useState("");
  const [searchString, setSearchString] = useState("");
  const [notification, setNotification] = useState(null);

  useEffect(() => {
    personService.getAll().then(items => {
      setPersons(items);
    });
  }, []);

  useEffect(() => {
    const objects =
      searchString.length === 0
        ? persons
        : persons.filter(person =>
            person.name.toLowerCase().includes(searchString)
          );
    setFiltered(objects);
  }, [searchString, persons]);

  const addPerson = event => {
    event.preventDefault();

    const personObject = {
      name: newName,
      number: newNumber
    };

    const names = persons.map(person => person.name);

    if (names.includes(newName)) {
      if (
        window.confirm(
          `${newName} is already added to the phonebook, replace the old number with a new one?`
        )
      ) {
        const person = persons.find(p => p.name === newName);
        personService
          .update(person.id, personObject)
          .then(updated => {
            setPersons(persons.map(p => (p.id === person.id ? updated : p)));
            setNotification({
              message: ` Updated ${updated.name}`,
              error: false
            });
            setTimeout(() => {
              setNotification(null);
            }, 5000);
          })
          .catch(error => {
            setNotification({
              message: ` information of ${personObject.name} has already been removed from server`,
              error: true
            });
            setTimeout(() => {
              setNotification(null);
            }, 5000);
          });
      }
    } else {
      personService
        .create(personObject)
        .then(data => {
          setPersons(persons.concat(data));
          setNewName("");
          setNewNumber("");
          setNotification({
            message: ` Added ${personObject.name}`,
            error: false
          });
          setTimeout(() => {
            setNotification(null);
          }, 5000);
        })
        .catch(error => {
          console.log("error", error);
        });
    }
  };

  const handleNameChange = event => {
    setNewName(event.target.value);
  };
  const handleNumberChange = event => {
    setNewNumber(event.target.value);
  };
  const handleSearchChange = event => {
    setSearchString(event.target.value);
  };

  const handleDelete = person => {
    if (window.confirm(`Delete ${person.name}`)) {
      personService.remove(person.id).then(response => {
        if (response.status === 200) {
          const filtered = persons.filter(p => p.id !== person.id);
          setPersons(filtered);
        }
      });
    }
  };

  return (
    <div>
      <h2>Phonebook</h2>
      <Notification notification={notification}></Notification>
      <Filter searchString={searchString} onChange={handleSearchChange} />
      <h2>add a new</h2>
      <PersonForm
        addPerson={addPerson}
        newName={newName}
        onNameChange={handleNameChange}
        newNumber={newNumber}
        onNumberChange={handleNumberChange}
      />

      <h2>Numbers</h2>
      <Persons persons={filtered} onClick={handleDelete} />
    </div>
  );
};

const Persons = ({ persons, onClick }) => {
  return persons.map(person => (
    <Person key={person.id} person={person} onClick={onClick} />
  ));
};
const Person = ({ person, onClick }) => {
  const { name, number } = person;
  return (
    <div key={person.id}>
      {name} {number} <button onClick={() => onClick(person)}>delete</button>
    </div>
  );
};

const Notification = ({ notification }) => {
  if (notification === null) return null;
  const { message, error } = notification;
  const className = error ? "error" : "success";
  return <div className={className}>{message}</div>;
};

export default App;
