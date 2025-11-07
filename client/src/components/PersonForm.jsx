import { useState } from "react";

import { Stack, TextField, Button, InputAdornment } from "@mui/material";
import PersonIcon from "@mui/icons-material/Person";
import PhoneIcon from "@mui/icons-material/Phone";

const PersonForm = ({ addPerson }) => {
  const [name, setName] = useState("");
  const [number, setNumber] = useState("");

  const handleSubmit = event => {
    event.preventDefault();
    addPerson(event, name, number);
    setName("");
    setNumber("");
  };

  return (
    <form onSubmit={handleSubmit} className="container">
      <Stack spacing={2}>
        <TextField
          label="Name"
          value={name}
          onChange={event => setName(event.target.value)}
          fullWidth
          slotProps={{
            input: {
              startAdornment: (
                <InputAdornment>
                  <PersonIcon style={{ paddingRight: "10px"}} fontSize="small" />
                </InputAdornment>
              ),
            },
          }}
          required
          />
        <TextField
          label="Number"
          value={number}
          onChange={event => setNumber(event.target.value)}
          fullWidth
          slotProps={{
            input: {
              startAdornment: (
                <InputAdornment>
                  <PhoneIcon style={{ paddingRight: "10px"}} />
                </InputAdornment>
              ),
            },
          }}
          required
        />
        <Button 
          type="submit"
          variant="contained"
          size="large"
          fullWidth
        >
          add
        </Button>
      </Stack>
    </form>
  );
};

export default PersonForm;