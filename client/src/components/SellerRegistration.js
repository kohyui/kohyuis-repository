import React, { useState, useEffect } from 'react';
import { Formik, Form, Field, ErrorMessage, FieldArray } from 'formik';
import * as Yup from 'yup';
import { useNavigate } from 'react-router-dom';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import api from './api'; // Import the centralized Axios instance
import './SellerRegistration.css';
import { useAuth } from './AuthContext'; // Import the auth context to get user data

const SellerRegistration = () => {
  const navigate = useNavigate();
  const { user, setUser } = useAuth(); // Get the user data from context
  const [uploadedProfilePicture, setUploadedProfilePicture] = useState(user?.profilePicture || ''); // Set initial state for profile picture

  useEffect(() => {
    // Redirect to Profile page if the user is already a seller
    if (user?.isSeller) {
      navigate('/profile');
    }
  }, [user, navigate]);

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

  const initialValues = {
    fullName: user?.fullName || '',
    displayName: user?.displayName || '',
    profilePicture: user?.profilePicture || '',
    description: '',
    personalWebsite: '',
    instagram: '',
    certifications: [{ certificate: '', certifiedFrom: '', year: null }],
    languages: [{ language: '', level: '' }],
    skills: ['', '']
  };

  const validationSchema = Yup.object({
    fullName: Yup.string().required('Full Name is required'),
    displayName: Yup.string().required('Display Name is required'),
    description: Yup.string().required('Description is required'),
    personalWebsite: Yup.string().matches(/(https?:\/\/)?(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/, 'Invalid URL'),
    instagram: Yup.string().matches(/(https?:\/\/)?(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/, 'Invalid URL'),
    certifications: Yup.array().of(
      Yup.object({
        certificate: Yup.string(),
        certifiedFrom: Yup.string(),
        year: Yup.number().required('Year is required').typeError('Year must be a number')
      })
    ).max(5, 'You can add up to 5 certifications'),
    languages: Yup.array().of(
      Yup.object({
        language: Yup.string().required('Language is required'),
        level: Yup.string().required('Level is required')
      })
    ).max(5, 'You can add up to 5 languages'),
    skills: Yup.array().of(Yup.string().required('Skill is required'))
      .min(2, 'Select at least 2 skills')
      .max(5, 'Select at most 5 skills')
  });

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

  const onSubmit = async (values, { setSubmitting }) => {
    console.log('Submitting values:', values);

    try {
      const token = localStorage.getItem('authToken');  // Retrieve token from local storage
      if (!token) {
        console.error('No token found in local storage');
        setSubmitting(false);
        return;
      }

      const response = await api.post('/users/update-seller-info', values, {
        headers: {
          'Authorization': `Bearer ${token}`  // Correctly set the Authorization header
        },
      });

      if (response.data) {
        setUser(response.data.user); // Update the user data in context
        navigate('/profile'); // Redirect to profile page after successful registration
      }
    } catch (error) {
      console.error('Registration error:', error);
      if (error.response) {
        console.error('Error details:', error.response.data);  // Debugging log
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="seller-registration-container">
      <h2 className="form-heading">Become a Seller</h2>

      {/* Display user information if available */}
      {user && (
        <div className="user-info">
          <h3>User Information</h3>
          <div>
            <strong>Username:</strong> {user.username}
          </div>
          <div>
            <strong>Email:</strong> {user.email}
          </div>
          {user.profilePicture && (
            <div className="profile-picture">
              <img src={user.profilePicture} alt="Profile" />
            </div>
          )}
        </div>
      )}

      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={onSubmit}
      >
        {({ isSubmitting, setFieldValue }) => (
          <Form className="form">
            {/* Full Name */}
            <div className="form-group">
              <label>Full Name (Private)</label>
              <Field type="text" name="fullName" />
              <ErrorMessage name="fullName" component="div" className="error-message" />
            </div>

            {/* Display Name */}
            <div className="form-group">
              <label>Display Name</label>
              <Field type="text" name="displayName" />
              <ErrorMessage name="displayName" component="div" className="error-message" />
            </div>

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

            {/* Description */}
            <div className="form-group">
              <label>Description</label>
              <Field as="textarea" name="description" placeholder="Share a bit about your work experience, cool project you've completed, and your area of expertise" className="description-field" />
              <ErrorMessage name="description" component="div" className="error-message" />
            </div>

            {/* Personal Website and Instagram */}
            <div className="form-group">
              <label>Personal Website</label>
              <Field type="text" name="personalWebsite" />
              <ErrorMessage name="personalWebsite" component="div" className="error-message" />
            </div>
            <div className="form-group">
              <label>Instagram</label>
              <Field type="text" name="instagram" />
              <ErrorMessage name="instagram" component="div" className="error-message" />
            </div>
            <div className="form-group">
              <label> Other Social Media </label>
              <Field type="text" name="socialMedia" />
              <ErrorMessage name="socialMedia" component="div" className="error-message" />
            </div>

            {/* Skills */}
            <div className="form-group">
              <label>Skills</label>
              <FieldArray name="skills">
                {({ remove, push, form }) => (
                  <div>
                    {form.values.skills.map((skill, index) => (
                      <div key={index} className="skills-field">
                        <Field as="select" name={`skills.${index}`}>
                          <option value="">Select Skill</option>
                          {skillsOptions.map((skill, idx) => (
                            <option key={idx} value={skill}>{skill}</option>
                          ))}
                        </Field>
                        <ErrorMessage name={`skills.${index}`} component="div" className="error-message" />
                        {form.values.skills.length > 2 && (
                          <button type="button" className="remove-button" onClick={() => remove(index)}>
                            Remove
                          </button>
                        )}
                      </div>
                    ))}
                    {form.values.skills.length < 5 && (
                      <button type="button" className="add-button" onClick={() => push('')}>
                        Add Skill
                      </button>
                    )}
                  </div>
                )}
              </FieldArray>
              <ErrorMessage name="skills" component="div" className="error-message" />
            </div>

            {/* Certifications */}
            <div className="form-group">
              <label>Certifications</label>
              <FieldArray name="certifications">
                {({ remove, push, form }) => (
                  <div>
                    {form.values.certifications.map((certification, index) => (
                      <div key={index} className="certification-field">
                        <Field type="text" name={`certifications.${index}.certificate`} placeholder="Certificate or Award"/>
                        <Field type="text" name={`certifications.${index}.certifiedFrom`} placeholder="Certified From (e.g. Nanyang Academy of Fine Arts (NAFA))"/>
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
                              maxDate={new Date()} // Restrict to current or past dates
                            />
                          )}
                        </Field>
                        <ErrorMessage name={`certifications.${index}.certificate`} component="div" className="error-message" />
                        <ErrorMessage name={`certifications.${index}.certifiedFrom`} component="div" className="error-message" />
                        <ErrorMessage name={`certifications.${index}.year`} component="div" className="error-message" />
                        {form.values.certifications.length > 1 && (
                          <button type="button" className="remove-button" onClick={() => remove(index)}>
                            Remove
                          </button>
                        )}
                      </div>
                    ))}
                    {form.values.certifications.length < 5 && (
                      <button type="button" className="add-button" onClick={() => push({ certificate: '', certifiedFrom: '', year: null })}>
                        Add Row
                      </button>
                    )}
                  </div>
                )}
              </FieldArray>
            </div>

            {/* Languages */}
            <div className="form-group">
              <label>Languages and Competency Levels</label>
              <FieldArray name="languages">
                {({ remove, push, form }) => (
                  <div>
                    {form.values.languages.map((language, index) => (
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
                        {form.values.languages.length > 1 && (
                          <button type="button" className="remove-button" onClick={() => remove(index)}>
                            Remove
                          </button>
                        )}
                      </div>
                    ))}
                    {form.values.languages.length < 5 && (
                      <button type="button" className="add-button" onClick={() => push({ language: '', level: '' })}>
                        Add Language
                      </button>
                    )}
                  </div>
                )}
              </FieldArray>
            </div>

            {/* Submit Button */}
            <div className="form-group">
              <button type="submit" disabled={isSubmitting}>
                Submit
              </button>
            </div>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default SellerRegistration;
