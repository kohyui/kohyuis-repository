import React from 'react';
import { IconButton, Card, CardContent, Typography, Tooltip, CardMedia, Box } from '@mui/material';
import InstagramIcon from '@mui/icons-material/Instagram'; // Instagram icon
import LanguageIcon from '@mui/icons-material/Language'; // Generic web icon for website

const GigCard = ({ gig }) => {
  // Function to shorten the description
  const shortenDescription = (description) => {
    const words = description.split(' ');
    return words.length > 10 ? `${words.slice(0, 10).join(' ')}...` : description;
  };

  return (
    <Box sx={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between' }}>
      <Card sx={{
        height: '100%',
        width: '350px',
        display: 'flex',
        flexDirection: 'column',
      }}>
        {/* Display seller's profile picture and display name */}
        <Box sx={{ display: 'flex', alignItems: 'center', marginTop: '20px', marginLeft: '8px', marginRight: '8px' }}>
          <CardMedia
            component="img"
            image={gig.sellerProfilePicture}  // Seller's profile picture from the gig data
            alt={gig.sellerDisplayName}       // Seller's display name used for alt text
            sx={{ width: 32, height: 32, borderRadius: '50%', marginRight: '10px' }}
          />
          <Typography variant="h6" color="text.primary" sx={{ fontSize: '14px', fontWeight: 'bold' }}>
            {gig.sellerDisplayName}  {/* Seller's display name */}
          </Typography>
        </Box>

        <CardContent sx={{ padding: '0 8px', flexGrow: 1, display: 'flex', flexDirection: 'column', alignItems: 'flex-start', marginTop: '10px' }}>
          <Tooltip title={<Typography sx={{ textAlign: 'left' }}>{gig.description}</Typography>} placement="bottom">
            <Typography variant="body2" color="text.secondary" sx={{ fontSize: '12px', textAlign: 'left', width: '100%' }}>
              {shortenDescription(gig.description)}  {/* Shortened gig description */}
            </Typography>
          </Tooltip>

          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%', marginTop: '8px' }}>
            <Typography variant="body2" color="text.secondary" sx={{ fontSize: '12px', fontWeight: 'bold' }}>
              {gig.price}  {/* Gig price */}
            </Typography>

            <Box>
              {/* Instagram Icon */}
              {gig.sellerInstagram && (
                <IconButton component="a" href={gig.sellerInstagram} target="_blank" aria-label="Instagram">
                  <InstagramIcon />
                </IconButton>
              )}
              {/* Website Icon */}
              {gig.sellerWebsite && (
                <IconButton component="a" href={gig.sellerWebsite} target="_blank" aria-label="Website">
                  <LanguageIcon />
                </IconButton>
              )}
            </Box>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
};

export default GigCard;
