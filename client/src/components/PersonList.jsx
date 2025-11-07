import { Button, Table, TableHead, TableBody, TableRow, TableCell } from "@mui/material";

const PersonList = ({ persons, handleDelete }) => {
  return (
    <Table size="small">
      <TableHead>
        <TableRow>
          <TableCell>Name</TableCell>
          <TableCell>Number</TableCell>
          <TableCell></TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {persons.map(p => {
          return (
            <TableRow key={p.id}>
              <TableCell>{p.name}</TableCell>
              <TableCell>{p.number}</TableCell>
              <TableCell>
                <Button
                  color="error"
                  variant="outlined"
                  size="small"
                  onClick={() => handleDelete(p)}
                >
                  Delete
                </Button>
              </TableCell>
            </TableRow>
          );
        })}
      </TableBody>
    </Table>
  );
};

export default PersonList;