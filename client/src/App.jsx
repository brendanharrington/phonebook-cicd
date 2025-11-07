import { useEffect, useState } from "react";
import { Stack, Alert, Container, TextField, InputAdornment, IconButton } from "@mui/material";
import FilterAltIcon from "@mui/icons-material/FilterAlt";
import ClearIcon from "@mui/icons-material/Clear";

import Header from "./components/Header";
import Subheading from "./components/Subheading";
import PersonForm from "./components/PersonForm";
import PersonList from "./components/PersonList";

import personService from "./services/persons";

const App = () => {
  const [alert, setAlert] = useState(null);
  const [persons, setPersons] = useState([]);
  const [filter, setFilter] = useState("");

  useEffect(() => {
    personService
      .getAll()
      .then(initialPersons => {
        setPersons(initialPersons);
      })
      .catch(error => {
        console.error("Failed to load persons:", error);
        showAlert({
          type: "error",
          message: "Failed to load persons from server.",
        });
      });
  }, []);

  const showAlert = obj => {
    const { type, message } = obj;
    setAlert({ type, message });
    setTimeout(() => setAlert(null), 5000);
  };

  const addPerson = (event, name, number) => {
    event.preventDefault();
    const personObj = { name, number };

    const existingPerson = persons.find(p => p.name === personObj.name);

    if (existingPerson && existingPerson.number === personObj.number) {
      showAlert({
        type: "error",
        message: `"${name}" is already added to the phonebook!`,
      });
    } else if (existingPerson && existingPerson.number !== personObj.number) {
      // pass the existing person and the new number
      handleReplace(existingPerson, personObj.number);
    } else {
      personService
        .create(personObj)
        .then(returnedPerson => {
          setPersons(prev => prev.concat(returnedPerson));
          showAlert({
            type: "success",
            message: `"${name}" added successfully!`,
          });
        })
        .catch(error => {
          let errMsg = error?.response?.data?.error || error?.message || "An unexpected error occurred.";
          if (typeof errMsg === "object") {
            errMsg = JSON.stringify(errMsg);
          }
          console.error(errMsg);
          showAlert({
            type: "error",
            message: `Person validation failed: ${errMsg}`,
          });
        });
    }
  };

  const handleFilterChange = (event) => {
    const value = event.target.value || "";
    setFilter(value);
  };

  

  const handleDelete = (person) => {
    if (window.confirm(`Delete ${person.name}?`)) {
      personService
        .remove(person.id)
        .then(() => {
          setPersons(prev => prev.filter(p => p.id !== person.id));
          showAlert({
            type: "success",
            message: `${person.name} deleted successfully!`,
          });
        })
        .catch(error => {
          console.error("Error deleting person:", error);
          showAlert({
            type: "error",
            message: `Information for ${person.name} has already been removed from the server.`,
          });
          setPersons(prev => prev.filter(p => p.id !== person.id));
        });
    }
  };

  const handleReplace = (person, newNumber) => {
    const updatedPerson = { ...person, number: newNumber };

    if (window.confirm(`${person.name} already exists in the phonebook. Replace the old number with a new one?`)) {
      personService
        .replace(person.id, updatedPerson)
        .then(returnedPerson => {
          setPersons(prev => prev.map(p => p.id !== person.id ? p : returnedPerson));
          showAlert({
            type: "success",
            message: `Number for ${person.name} updated successfully!`,
          });
        })
        .catch(error => {
          const errData = error?.response?.data;
          const status = error?.response?.status;
          if (errData?.error) {
            const msg = typeof errData.error === "object" ? JSON.stringify(errData.error) : errData.error;
            showAlert({
              type: "error",
              message: `Error: ${msg}`,
            });
          } else if (status === 404) {
            showAlert({
              type: "error",
              message: `Information for ${person.name} has already been removed from the server.`,
            });
            setPersons(prev => prev.filter(p => p.id !== person.id));
          } else {
            console.error("Error updating person:", error);
            showAlert({
              type: "error",
              message: "An unexpected error occurred.",
            });
          }
        });
    }
  };

  if (!persons) {
    return <p>loading</p>;
  }

  const displayedPersons = filter
    ? persons.filter(p => p.name.toLowerCase().includes(filter.toLowerCase()))
    : persons;

  return (
    <Container sx={{ mt: 3 }}>
      <Header />
      {alert && <Alert severity={alert.type} sx={{ mt: 3 }}>{alert.message}</Alert>}

      <Stack spacing={3} sx={{ mt: 3 }}>
        <Stack spacing={2}>
          <Subheading content={"Add a new person"} />
          <PersonForm {...{ showAlert, setPersons, persons, addPerson }}/>
        </Stack>

        <Stack spacing={2}>
          <Subheading content={"People"}/>
          <TextField
            label="Filter by name"
            onChange={handleFilterChange}
            value={filter}
            fullWidth
            slotProps={{
              input: {
                startAdornment: (
                  <InputAdornment>
                    <FilterAltIcon style={{ paddingRight: "10px"}} fontSize="small" />
                  </InputAdornment>
                ),
                endAdornment: (
                  <InputAdornment>
                    <IconButton onClick={() => setFilter("")}>
                      <ClearIcon fontSize="small" />
                    </IconButton>
                  </InputAdornment>
                ),
              },
            }}
          />
          
          <PersonList {...{ persons: displayedPersons, handleDelete }} />
        </Stack>
      </Stack>
    </Container>
  );
};

export default App;