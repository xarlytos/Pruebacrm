import React, { useState } from 'react';
import { TextField, Select, MenuItem, FormControl, InputLabel, Button } from '@mui/material';
import { LocalizationProvider, DatePicker } from '@mui/lab';
import AdapterDateFns from '@mui/lab/AdapterDateFns';
import './Modal.css';

function CreateAdModal({ onClose }) {
  const [campaignName, setCampaignName] = useState('');
  const [adType, setAdType] = useState('Imagen');
  const [platform, setPlatform] = useState('Google Ads');
  const [budget, setBudget] = useState('');
  const [location, setLocation] = useState('');
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [targetAudience, setTargetAudience] = useState('');
  const [targetGender, setTargetGender] = useState('Masculino');
  const [adLink, setAdLink] = useState('');
  const [adImage, setAdImage] = useState(null);

  const handleImageUpload = (event) => {
    setAdImage(event.target.files[0]);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    // Aquí puedes manejar el envío del formulario, por ejemplo, enviando los datos al backend
    console.log({
      campaignName,
      adType,
      platform,
      budget,
      location,
      startDate,
      endDate,
      targetAudience,
      targetGender,
      adLink,
      adImage,
    });
    onClose();
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>Nuevo anuncio</h2>
        <form onSubmit={handleSubmit}>
          <TextField
            label="Nombre de la campaña"
            value={campaignName}
            onChange={(e) => setCampaignName(e.target.value)}
            fullWidth
            margin="normal"
          />
          <FormControl fullWidth margin="normal">
            <InputLabel>Tipo de anuncio</InputLabel>
            <Select value={adType} onChange={(e) => setAdType(e.target.value)}>
              <MenuItem value="Imagen">Imagen</MenuItem>
              <MenuItem value="Video">Video</MenuItem>
              <MenuItem value="Texto">Texto</MenuItem>
            </Select>
          </FormControl>
          <FormControl fullWidth margin="normal">
            <InputLabel>Plataforma</InputLabel>
            <Select value={platform} onChange={(e) => setPlatform(e.target.value)}>
              <MenuItem value="Google Ads">Google Ads</MenuItem>
              <MenuItem value="Facebook Ads">Facebook Ads</MenuItem>
              <MenuItem value="Instagram Ads">Instagram Ads</MenuItem>
            </Select>
          </FormControl>
          <TextField
            label="Presupuesto"
            value={budget}
            onChange={(e) => setBudget(e.target.value)}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Ubicación geográfica"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            fullWidth
            margin="normal"
          />
          <LocalizationProvider dateAdapter={AdapterDateFns}>
            <DatePicker
              label="Fecha de inicio"
              value={startDate}
              onChange={setStartDate}
              renderInput={(params) => <TextField {...params} fullWidth margin="normal" />}
            />
            <DatePicker
              label="Fecha de fin"
              value={endDate}
              onChange={setEndDate}
              renderInput={(params) => <TextField {...params} fullWidth margin="normal" />}
            />
          </LocalizationProvider>
          <TextField
            label="Público objetivo"
            value={targetAudience}
            onChange={(e) => setTargetAudience(e.target.value)}
            fullWidth
            margin="normal"
          />
          <FormControl fullWidth margin="normal">
            <InputLabel>Género objetivo</InputLabel>
            <Select value={targetGender} onChange={(e) => setTargetGender(e.target.value)}>
              <MenuItem value="Masculino">Masculino</MenuItem>
              <MenuItem value="Femenino">Femenino</MenuItem>
              <MenuItem value="Todos">Todos</MenuItem>
            </Select>
          </FormControl>
          <TextField
            label="Enlace al anuncio"
            value={adLink}
            onChange={(e) => setAdLink(e.target.value)}
            fullWidth
            margin="normal"
          />
          <Button variant="contained" component="label" fullWidth margin="normal">
            Imagen del anuncio
            <input type="file" hidden onChange={handleImageUpload} />
          </Button>
          {adImage && <p>{adImage.name}</p>}
          <Button type="submit" variant="contained" color="primary" fullWidth>
            Nuevo anuncio
          </Button>
        </form>
        <Button className="close-button" onClick={onClose}>
          Cerrar
        </Button>
      </div>
    </div>
  );
}

export default CreateAdModal;
