import { Typography } from "@mui/material";

const Subheading = ({ content }) => {
  return (
    <Typography variant="h4" component="h2">
      {content}
    </Typography>
  );
};

export default Subheading;