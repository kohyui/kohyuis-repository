import React from 'react';
import { IconButton, Card, CardContent, Typography, Tooltip, CardMedia, Box } from '@mui/material';
import InstagramIcon from '@mui/icons-material/Instagram';
import LanguageIcon from '@mui/icons-material/Language';
import Slider from "react-slick";
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import "slick-carousel/slick/slick.css"; 
import "slick-carousel/slick/slick-theme.css"; 

const GigCard = ({ gig }) => {
  // Function to shorten the description
  const shortenDescription = (description) => {
    const words = description.split(' ');
    return words.length > 10 ? `${words.slice(0, 10).join(' ')}...` : description;
  };

  // Function to ensure links have the correct prefix
  const formatLink = (url) => {
    if (url && !url.startsWith('https://') && !url.startsWith('http://')) {
      return `https://${url}`;
    }
    return url;
  };

  // Minimalist Custom Arrow components
  const NextArrow = ({ onClick }) => (
    <IconButton
      onClick={onClick}
      sx={{
        position: 'absolute',
        top: '50%',
        right: '10px',
        transform: 'translateY(-50%)',
        zIndex: 1,
        backgroundColor: 'transparent',
        color: '#444',
        '&:hover': { color: '#111' },
        fontSize: '18px',
      }}
    >
      <ArrowForwardIosIcon sx={{ fontSize: '18px' }} />
    </IconButton>
  );

  const PrevArrow = ({ onClick }) => (
    <IconButton
      onClick={onClick}
      sx={{
        position: 'absolute',
        top: '50%',
        left: '10px',
        transform: 'translateY(-50%)',
        zIndex: 1,
        backgroundColor: 'transparent',
        color: '#444',
        '&:hover': { color: '#111' },
        fontSize: '18px',
      }}
    >
      <ArrowBackIosIcon sx={{ fontSize: '18px' }} />
    </IconButton>
  );

  // Slick carousel settings
  const sliderSettings = {
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: true,
    nextArrow: <NextArrow />,
    prevArrow: <PrevArrow />,
  };

  return (
    <Box sx={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between' }}>
      <Card sx={{ height: '100%', width: '350px', display: 'flex', flexDirection: 'column', boxShadow: 'none', border: '1px solid #ddd' }}>
        {/* Display the portfolio images in a carousel */}
        <Box sx={{ position: 'relative', width: '100%', height: '230px', overflow: 'hidden', marginBottom: '0px', padding: '0px' }}>
          <Slider {...sliderSettings}>
            {gig.portfolioImages && gig.portfolioImages.length > 0 ? (
              gig.portfolioImages.map((image, index) => (
                <CardMedia
                  key={index}
                  component="img"
                  image={image} // Use each image URL from the portfolioImages array
                  alt={`Portfolio Image ${index + 1}`}
                  sx={{
                    width: '100%',
                    maxHeight: '230px',
                    objectFit: 'contain',
                    borderRadius: '4px',
                  }}
                />
              ))
            ) : (
              <Typography variant="body2" color="text.secondary" sx={{ padding: '16px', textAlign: 'center' }}>
                No Portfolio Images Available
              </Typography>
            )}
          </Slider>
        </Box>

        {/* Display seller's profile picture and display name */}
        <Box sx={{ display: 'flex', alignItems: 'center', paddingLeft: '8px', marginBottom: '0px', marginTop: '0px', paddingTop: '0px', paddingBottom: '0px' }}>
          <CardMedia
            component="img"
            image={gig.sellerProfilePicture}  // Seller's profile picture from the gig data
            alt={gig.sellerDisplayName}       // Seller's display name used for alt text
            sx={{ width: 28, height: 28, borderRadius: '50%', marginRight: '8px' }}
          />
          <Typography variant="h6" color="text.primary" sx={{ fontSize: '12px', fontWeight: 'bold', lineHeight: 1.2 }}>
            {gig.sellerDisplayName}  {/* Seller's display name */}
          </Typography>
        </Box>

        <CardContent sx={{ padding: '0 8px', marginTop: '4px' }}>
          <Tooltip title={<Typography sx={{ textAlign: 'left' }}>{gig.description}</Typography>} placement="bottom">
            <Typography variant="body2" color="text.secondary" sx={{ fontSize: '12px', textAlign: 'left', width: '100%', lineHeight: 1.4 }}>
              {shortenDescription(gig.description)}  {/* Shortened gig description */}
            </Typography>
          </Tooltip>

          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%', marginTop: '4px' }}>
            <Typography variant="body2" color="text.secondary" sx={{ fontSize: '12px', fontWeight: 'bold', lineHeight: 1.2 }}>
              S${gig.price}  {/* Added S$ prefix for the price */}
            </Typography>

            <Box>
              {/* Instagram Icon */}
              {gig.sellerInstagram && (
                <IconButton component="a" href={formatLink(gig.sellerInstagram)} target="_blank" aria-label="Instagram">
                  <InstagramIcon sx={{ fontSize: '18px', color: '#666' }} />
                </IconButton>
              )}
              {/* Website Icon */}
              {gig.sellerWebsite && (
                <IconButton component="a" href={formatLink(gig.sellerWebsite)} target="_blank" aria-label="Website">
                  <LanguageIcon sx={{ fontSize: '18px', color: '#666' }} />
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
