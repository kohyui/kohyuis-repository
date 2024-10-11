import React, { useEffect, useState } from 'react';
import { Typography, Box, Button, Divider, Avatar, Paper } from '@mui/material';
import { useAuth } from './AuthContext';
import Layout from './Layout';
import api from './api';
import { Formik, Form, Field, ErrorMessage, FieldArray } from 'formik';
import * as Yup from 'yup';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

function Profile() {
  const { user, setUser, logOut } = useAuth();
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [uploadedProfilePicture, setUploadedProfilePicture] = useState(user?.profilePicture || '');

  const languages = [
    'English', 'Mandarin', 'Malay', 'Tamil', 'Spanish', 'Hindi', 'Arabic', 'Portuguese', 'Bengali', 'Russian', 'Japanese', 'Punjabi', 'German',
  ];

  const languageLevels = ['Basic', 'Conversational', 'Fluent', 'Native/Bilingual'];
  const skillsOptions = [
    'General Photography', 'Still Photography', 'Food Photography', 'Product Photography', 'Sports Photography', 
    'Wedding Photography', 'Architectural Photography', 'Travel Photography', 'Analog Photography', 'Animal Photography', 
    'Photo Design', 'Photo Editing', 'Photo Enhancement', 'Photo Slideshow', 'Photo Effects', 'Photo Resizing', 
    'Photo Animation', 'Photo Montage', 'Affinity Photo'
  ];

  const validationSchema = Yup.object({
    profilePicture: Yup.string().required('Profile picture is required'),
    ...(user?.isSeller && {
      fullName: Yup.string().required('Full Name is required'),
      displayName: Yup.string().required('Display Name is required'),
      description: Yup.string().required('Description is required'),
      personalWebsite: Yup.string().matches(
        /(https?:\/\/)?(www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_+.~#?&//=]*)/,
        'Invalid URL'
      ),
      instagram: Yup.string().matches(
        /(https?:\/\/)?(www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_+.~#?&//=]*)/,
        'Invalid URL'
      ),
      skills: Yup.array().of(Yup.string().required('Skill is required')).min(2, 'Select at least 2 skills').max(5, 'Select at most 5 skills'),
      certifications: Yup.array().of(
        Yup.object({
          certificate: Yup.string(),
          certifiedFrom: Yup.string(),
          year: Yup.number().required('Year is required').typeError('Year must be a number'),
        })
      ).max(5, 'You can add up to 5 certifications'),
      languages: Yup.array().of(
        Yup.object({
          language: Yup.string().required('Language is required'),
          level: Yup.string().required('Level is required')
        })
      ).max(5, 'You can add up to 5 languages'),
    }),
  });

  const fetchUserData = async () => {
    try {
      const token = localStorage.getItem('authToken');
      if (!token) {
        console.error('No token found in local storage');
        return;
      }

      const response = await api.get('/users/me', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.data && response.data.user) {
        setUser(response.data.user);
        setUploadedProfilePicture(response.data.user.profilePicture);
      } else {
        console.error('No user data returned from API');
      }
    } catch (error) {
      console.error('Failed to fetch user data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserData();
  }, []);

  const handleLogout = () => {
    logOut();
  };

  const handleProfilePictureUpload = async (e, setFieldValue) => {
    const file = e.target.files[0];
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', process.env.REACT_APP_CLOUDINARY_UPLOAD_PRESET);

    try {
      const response = await api.post(
        `https://api.cloudinary.com/v1_1/${process.env.REACT_APP_CLOUDINARY_CLOUD_NAME}/image/upload`,
        formData
      );
      setUploadedProfilePicture(response.data.secure_url);
      setFieldValue('profilePicture', response.data.secure_url);
    } catch (error) {
      console.error('Error uploading image', error.response ? error.response.data : error);
    }
  };

  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      const token = localStorage.getItem('authToken');
      if (!token) {
        console.error('No token found in local storage');
        setSubmitting(false);
        return;
      }

      // Determine the appropriate API endpoint based on user type
      const endpoint = user.isSeller ? '/users/update-seller-info' : '/users/update-profile-picture';
      const dataToSend = user.isSeller ? values : { profilePicture: values.profilePicture };

      const response = await api.post(endpoint, dataToSend, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.data && response.data.user) {
        setUser(response.data.user);
        setEditing(false);
      } else {
        console.error('Failed to update profile');
      }
    } catch (error) {
      console.error('Update error:', error);
      if (error.response) {
        console.error('Error details:', error.response.data);
      }
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return <Typography variant="body1" align="center">Loading...</Typography>;
  }

  if (!user) {
    return <Typography variant="body1" align="center">No user data available.</Typography>;
  }

  return (
    <Layout>
      <Box sx={{ maxWidth: 600, mx: 'auto', p: 3 }}>
        <Paper elevation={3} sx={{ p: 3, borderRadius: 2 }}>
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mb: 3 }}>
            <Avatar
              alt={user.displayName || user.username}
              src={uploadedProfilePicture || user.profilePicture}
              sx={{ width: 100, height: 100, mb: 2 }}
            />
            <Typography variant="h6">{user.displayName || user.username}</Typography>
            <Typography variant="body2" color="textSecondary">{user.email}</Typography>
          </Box>

          {/* <Divider sx={{ my: 3 }} /> */}

          {user.isSeller && (
            <Box sx={{ textAlign: 'center', mb: 3 }}>
              <Typography variant="h6" sx={{ mb: 1 }}>Seller Details</Typography>
              
              {/* Display user information that cannot be edited */}
              {user.fullName && (
                <Typography variant="body2" color="textSecondary">
                  <strong>Full Name:</strong> {user.fullName}
                </Typography>
              )}
              
              {user.displayName && (
                <Typography variant="body2" color="textSecondary">
                  <strong>Display Name:</strong> {user.displayName}
                </Typography>
              )}
              
              {user.description && (
                <Typography variant="body2" color="textSecondary">
                  <strong>Description:</strong> {user.description}
                </Typography>
              )}
              
              {user.personalWebsite && (
                <Typography variant="body2" color="textSecondary">
                  <strong>Website:</strong> {user.personalWebsite}
                </Typography>
              )}
              
              {user.instagram && (
                <Typography variant="body2" color="textSecondary">
                  <strong>Instagram:</strong> {user.instagram}
                </Typography>
              )}
              
              {user.skills && user.skills.length > 0 && (
                <Typography variant="body2" color="textSecondary">
                  <strong>Skills:</strong> {user.skills.join(', ')}
                </Typography>
              )}
              
              {/* Certifications */}
              {user.certifications && user.certifications.length > 0 && (
                <Box sx={{ mt: 3 }}>
                  <Typography variant="h6" sx={{ mb: 1 }}>Certifications</Typography>
                  {user.certifications.map((cert, index) => (
                    <Typography variant="body2" color="textSecondary" key={index}>
                      {cert.certificate} from {cert.certifiedFrom} ({cert.year})
                    </Typography>
                  ))}
                </Box>
              )}

              {/* Languages */}
              {user.languages && user.languages.length > 0 && (
                <Box sx={{ mt: 3 }}>
                  <Typography variant="h6" sx={{ mb: 1 }}>Languages</Typography>
                  {user.languages.map((lang, index) => (
                    <Typography variant="body2" color="textSecondary" key={index}>
                      {lang.language} ({lang.level})
                    </Typography>
                  ))}
                </Box>
              )}
            </Box>
          )}

          <Divider sx={{ my: 3 }} />

          {/* Editing Form */}
          {editing ? (
            <Formik
              initialValues={{
                profilePicture: uploadedProfilePicture || '',
                fullName: user.fullName || '',  // Ensure full name is included in initial values
                ...(user.isSeller && {
                  displayName: user.displayName || '',
                  description: user.description || '',
                  personalWebsite: user.personalWebsite || '',
                  instagram: user.instagram || '',
                  certifications: user.certifications || [{ certificate: '', certifiedFrom: '', year: null }],
                  languages: user.languages || [{ language: '', level: '' }],
                  skills: user.skills || ['', ''],
                }),
              }}
              validationSchema={validationSchema}
              onSubmit={handleSubmit}
            >
              {({ isSubmitting, setFieldValue, values }) => (
                <Form>
                  {/* Profile Picture */}
                  <div className="form-group">
                    <label>Profile Picture</label>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleProfilePictureUpload(e, setFieldValue)}
                    />
                    <ErrorMessage name="profilePicture" component="div" className="error-message" />
                    {uploadedProfilePicture && (
                      <div className="profile-picture">
                        <img src={uploadedProfilePicture} alt="Profile" />
                      </div>
                    )}
                  </div>

                  {/* Editable Fields for Seller */}
                  {user.isSeller && (
                    <>
                      <div className="form-group">
                        <label>Full Name (Private)</label>
                        <Field type="text" name="fullName" />
                        <ErrorMessage name="fullName" component="div" className="error-message" />
                      </div>
                      <div className="form-group">
                        <label>Display Name</label>
                        <Field type="text" name="displayName" />
                        <ErrorMessage name="displayName" component="div" className="error-message" />
                      </div>
                      <div className="form-group">
                        <label>Description</label>
                        <Field as="textarea" name="description" className="description-field" />
                        <ErrorMessage name="description" component="div" className="error-message" />
                      </div>
                      <div className="form-group-inline">
                        <div className="form-group longer-input">
                          <label>Personal Website</label>
                          <Field type="text" name="personalWebsite" className="long-input" />
                          <ErrorMessage name="personalWebsite" component="div" className="error-message" />
                        </div>
                        <div className="form-group longer-input">
                          <label>Instagram</label>
                          <Field type="text" name="instagram" className="long-input" />
                          <ErrorMessage name="instagram" component="div" className="error-message" />
                        </div>
                      </div>

                      {/* Skills */}
                      <div className="form-group">
                        <label>Skills</label>
                        <FieldArray name="skills">
                          {({ remove, push }) => (
                            <div>
                              {values.skills.map((skill, index) => (
                                <div key={index} className="skills-field">
                                  <Field as="select" name={`skills.${index}`}>
                                    <option value="">Select Skill</option>
                                    {skillsOptions.map((skill, idx) => (
                                      <option key={idx} value={skill}>{skill}</option>
                                    ))}
                                  </Field>
                                  <ErrorMessage name={`skills.${index}`} component="div" className="error-message" />
                                  {values.skills.length > 2 && (
                                    <button type="button" className="remove-button" onClick={() => remove(index)}>
                                      Remove
                                    </button>
                                  )}
                                </div>
                              ))}
                              {values.skills.length < 5 && (
                                <button type="button" className="add-button" onClick={() => push('')}>
                                  Add Skill
                                </button>
                              )}
                            </div>
                          )}
                        </FieldArray>
                      </div>

                      {/* Certifications */}
                      <div className="form-group">
                        <label>Certifications</label>
                        <FieldArray name="certifications">
                          {({ remove, push }) => (
                            <div>
                              {values.certifications.map((cert, index) => (
                                <div key={index} className="certification-field">
                                  <Field type="text" name={`certifications.${index}.certificate`} placeholder="Certificate" />
                                  <Field type="text" name={`certifications.${index}.certifiedFrom`} placeholder="Certified From" />
                                  <Field name={`certifications.${index}.year`}>
                                    {({ field, form }) => (
                                      <DatePicker
                                        {...field}
                                        selected={field.value ? new Date(field.value, 0, 1) : null}
                                        onChange={(date) => form.setFieldValue(`certifications.${index}.year`, date ? date.getFullYear() : '')}
                                        showYearPicker
                                        dateFormat="yyyy"
                                        placeholderText="Year"
                                        className="year-field"
                                      />
                                    )}
                                  </Field>
                                  <ErrorMessage name={`certifications.${index}.certificate`} component="div" className="error-message" />
                                  <ErrorMessage name={`certifications.${index}.certifiedFrom`} component="div" className="error-message" />
                                  <ErrorMessage name={`certifications.${index}.year`} component="div" className="error-message" />
                                  {values.certifications.length > 1 && (
                                    <button type="button" className="remove-button" onClick={() => remove(index)}>
                                      Remove
                                    </button>
                                  )}
                                </div>
                              ))}
                              {values.certifications.length < 5 && (
                                <button type="button" className="add-button" onClick={() => push({ certificate: '', certifiedFrom: '', year: null })}>
                                  Add Certification
                                </button>
                              )}
                            </div>
                          )}
                        </FieldArray>
                      </div>

                      {/* Languages */}
                      <div className="form-group">
                        <label>Languages</label>
                        <FieldArray name="languages">
                          {({ remove, push }) => (
                            <div>
                              {values.languages.map((lang, index) => (
                                <div key={index} className="language-field">
                                  <Field as="select" name={`languages.${index}.language`}>
                                    <option value="">Select Language</option>
                                    {languages.map((l, idx) => (
                                      <option key={idx} value={l}>{l}</option>
                                    ))}
                                  </Field>
                                  <Field as="select" name={`languages.${index}.level`}>
                                    <option value="">Select Level</option>
                                    {languageLevels.map((level, idx) => (
                                      <option key={idx} value={level}>{level}</option>
                                    ))}
                                  </Field>
                                  <ErrorMessage name={`languages.${index}.language`} component="div" className="error-message" />
                                  <ErrorMessage name={`languages.${index}.level`} component="div" className="error-message" />
                                  {values.languages.length > 1 && (
                                    <button type="button" className="remove-button" onClick={() => remove(index)}>
                                      Remove
                                    </button>
                                  )}
                                </div>
                              ))}
                              {values.languages.length < 5 && (
                                <button type="button" className="add-button" onClick={() => push({ language: '', level: '' })}>
                                  Add Language
                                </button>
                              )}
                            </div>
                          )}
                        </FieldArray>
                      </div>
                    </>
                  )}                  
                  <Button type="submit" className="primary-button" disabled={isSubmitting} sx={{ textTransform: 'uppercase' }}>
                    Save Changes
                  </Button>
                </Form>
              )}
            </Formik>
          ) : (
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
            <Button 
              onClick={() => setEditing(true)} 
              className="primary-button" 
              sx={{ mr: 2 }}
            >
              Edit Profile
            </Button>
            <Button 
              onClick={handleLogout} 
              className="primary-button" 
              sx={{ ml: 2 }}
            >
              Log Out
            </Button>
          </Box>          
          )}
        </Paper>
      </Box>
    </Layout>
  );
}

export default Profile;
