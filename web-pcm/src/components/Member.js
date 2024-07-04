import React, { useState, useEffect } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  CircularProgress,
  Typography,
  Button,
  Modal,
  Box,
  TextField,
  IconButton,
} from "@mui/material";
import {
  Add as AddIcon,
  Close as CloseIcon,
  Delete as DeleteIcon,
  Edit as EditIcon,
} from "@mui/icons-material";
function Member() {
  const [member, setMember] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openModal, setOpenModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    nama: "",
    username: "",
    email: "",
    password: "",
  });

  const handleTambahData = () => {
    setIsEditing(false);
    setOpenModal(true);
  };

  const handleEditData = (data) => {
    setIsEditing(true);
    setFormData(data);
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
    setFormData({
      nama: "",
      username: "",
      email: "",
      password: "",
    });
  };

  const handleDeleteData = (id) => {
    if (!id) {
      console.error("ID is undefined or null");
      return;
    }

    fetch(`http://localhost:5000/member/${id}`, {
      method: "DELETE",
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then(() => {
        setMember(member.filter((item) => item.id !== id));
        console.log(`Member with ID ${id} deleted successfully`);
      })
      .catch((error) => console.error("Error:", error));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const method = isEditing ? "PUT" : "POST";
    const url = isEditing
      ? `http://localhost:5000/member/${formData.id}`
      : "http://localhost:5000/member";
    fetch(url, {
      method: method,
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    })
      .then((response) => response.json())
      .then((data) => {
        if (isEditing) {
          setMember(
            member.map((item) => (item.id === formData.id ? formData : item))
          );
        } else {
          setMember([...member, formData]);
        }
        handleCloseModal();
      })
      .catch((error) => console.error("Berhasil:", error));
  };

  useEffect(() => {
    fetch("http://localhost:5000/member")
      .then((response) => response.json())
      .then((data) => {
        setMember(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
        setLoading(false);
      });
  }, []);
  if (loading) {
    return <CircularProgress />;
  }
  return (
    <TableContainer component={Paper}>
      <Typography variant="h4" gutterBottom>
        Data User
      </Typography>

      <Button
        variant="contained"
        color="primary"
        startIcon={<AddIcon />}
        style={{ marginBottom: "20px" }}
        onClick={handleTambahData}
      >
        Tambah Data
      </Button>

      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Id</TableCell>
            <TableCell>Nama</TableCell>
            <TableCell>Username</TableCell>
            <TableCell>email</TableCell>
            <TableCell>Option</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {member.map((row) => (
            <TableRow key={row.id}>
              <TableCell>{row.id}</TableCell>
              <TableCell>{row.nama}</TableCell>
              <TableCell>{row.username}</TableCell>
              <TableCell>{row.email}</TableCell>
              <TableCell>
                <IconButton onClick={() => handleEditData(row)} color="primary">
                  <EditIcon />
                </IconButton>
                <IconButton
                  onClick={() => handleDeleteData(row.id)}
                  color="primary"
                >
                  <DeleteIcon />
                </IconButton>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <Modal open={openModal} onClose={handleCloseModal}>
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 400,
            bgcolor: "background.paper",
            boxShadow: 24,
            p: 4,
          }}
        >
          <Typography variant="h6" gutterBottom>
            {isEditing ? "Edit Data Admin" : "Tambah Data Admin"}
            <IconButton
              aria-label="close"
              onClick={handleCloseModal}
              sx={{
                positon: "absolute",
                right: -140,
                top: -20,
                color: (theme) => theme.palette.grey[500],
              }}
            >
              <CloseIcon />
            </IconButton>
          </Typography>

          <form onSubmit={handleSubmit}>
            <TextField
              margin="normal"
              required
              fullWidth
              id="nama"
              label="nama"
              name="nama"
              value={formData.nama}
              onChange={handleChange}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              id="username"
              label="username"
              name="username"
              value={formData.username}
              onChange={handleChange}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              id="email"
              label="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              id="password"
              label="Password"
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              color="primary"
              sx={{ mt: 3, mb: 2 }}
            >
              Simpan
            </Button>
          </form>
        </Box>
      </Modal>
    </TableContainer>
  );
}
export default Member;
