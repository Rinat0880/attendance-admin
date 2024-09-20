import React, { useState } from 'react';
import {
  Paper,
  Typography,
  TextField,
  Button,
  Box,
  IconButton,
  Divider,
} from '@mui/material';
import { Edit as EditIcon } from '@mui/icons-material';

interface CompanySettings {
  companyName: string;
  logo: File | null;
  arrivalTime: string;
  departureTime: string;
  lateThreshold: string;
  earlyDepartureThreshold: string;
  overtimeThreshold: string;
}

const defaultSettings: CompanySettings = {
  companyName: '',
  logo: null,
  arrivalTime: '09:00',
  departureTime: '18:00',
  lateThreshold: '15',
  earlyDepartureThreshold: '15',
  overtimeThreshold: '60',
};

type EditModeState = {
  [K in keyof CompanySettings]: boolean;
};

const CompanySettings: React.FC = () => {
  const [settings, setSettings] = useState<CompanySettings>(defaultSettings);
  const [editMode, setEditMode] = useState<EditModeState>(
    Object.keys(defaultSettings).reduce((acc, key) => ({ ...acc, [key]: false }), {} as EditModeState)
  );

  const handleEdit = (field: keyof CompanySettings) => {
    setEditMode({ ...editMode, [field]: true });
  };

  const handleSave = (field: keyof CompanySettings) => {
    setEditMode({ ...editMode, [field]: false });
    console.log(`Saving ${field}:`, settings[field]);
  };

  const handleChange = (field: keyof CompanySettings, value: string | File | null) => {
    setSettings({ ...settings, [field]: value });
  };

  const renderEditableField = (field: keyof CompanySettings, label: string, type: string = 'text') => (
    <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
      <Typography variant="body1" sx={{ flexBasis: '50%', flexShrink: 0 }}>{label}</Typography>
      <Box display="flex" alignItems="center" justifyContent="flex-end" sx={{ flexBasis: '50%', flexShrink: 0 }}>
        {editMode[field] ? (
          <>
            <TextField
              type={type}
              value={settings[field] as string}
              onChange={(e) => handleChange(field, e.target.value)}
              size="small"
              sx={{ width: '120px', mr: 1 }}
            />
            <Button onClick={() => handleSave(field)} variant="contained" size="small">
              Сохранить
            </Button>
          </>
        ) : (
          <>
            <Typography mr={1}>{settings[field]?.toString()}</Typography>
            <IconButton onClick={() => handleEdit(field)} size="small">
              <EditIcon fontSize="small" />
            </IconButton>
          </>
        )}
      </Box>
    </Box>
  );

  return (
    <Paper elevation={3} sx={{ p: 4, borderRadius: 4, display: 'flex', flexDirection: 'column', mt: 3 }}>
      <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={3}>
        <Typography variant="h5">Настройки компании</Typography>
      </Box>
      
      <Box mb={4}>
        <Typography variant="h6" mb={2}>Вид компании</Typography>
        {renderEditableField('companyName', 'Название компании')}
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
          <Typography variant="body1" sx={{ flexBasis: '50%', flexShrink: 0 }}>Логотип</Typography>
          <Box sx={{ flexBasis: '50%', flexShrink: 0, display: 'flex', justifyContent: 'flex-end' }}>
            <input
              accept="image/*"
              style={{ display: 'none' }}
              id="logo-upload"
              type="file"
              onChange={(e) => {
                const file = e.target.files ? e.target.files[0] : null;
                handleChange('logo', file);
              }}
            />
            <label htmlFor="logo-upload">
              <Button variant="contained" component="span">
                Загрузить логотип
              </Button>
            </label>
          </Box>
        </Box>
        {settings.logo && (
          <Typography variant="body2" mt={1}>
            Выбран файл: {settings.logo.name}
          </Typography>
        )}
      </Box>
      
      <Divider sx={{ my: 3 }} />
      
      <Box>
        <Typography variant="h6" mb={2}>Правила посещаемости</Typography>
        {renderEditableField('arrivalTime', 'Время прихода', 'time')}
        {renderEditableField('departureTime', 'Время ухода', 'time')}
        {renderEditableField('lateThreshold', 'Порог опоздания (минуты)', 'number')}
        {renderEditableField('earlyDepartureThreshold', 'Порог раннего ухода (минуты)', 'number')}
        {renderEditableField('overtimeThreshold', 'Порог переработки (минуты)', 'number')}
      </Box>
    </Paper>
  );
};

export default CompanySettings;
