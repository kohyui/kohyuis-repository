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

  // Custom Arrow components for the slider
  const NextArrow = ({ onClick }) => (
    <IconButton
      onClick={onClick}
      sx={{
        position: 'absolute',
        top: '50%',
        right: '5px',
        transform: 'translateY(-50%)',
        zIndex: 1,
        backgroundColor: 'transparent',
        color: '#444',
        '&:hover': { color: '#111' },
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
        left: '5px',
        transform: 'translateY(-50%)',
        zIndex: 1,
        backgroundColor: 'transparent',
        color: '#444',
        '&:hover': { color: '#111' },
      }}
    >
      <ArrowBackIosIcon sx={{ fontSize: '18px' }} />
    </IconButton>
  );

  // Slider settings
  const sliderSettings = {
    dots: false, // Removed slider dots below the images
    infinite: gig.portfolioImages.length > 1,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: gig.portfolioImages.length > 1,
    nextArrow: <NextArrow />,
    prevArrow: <PrevArrow />,
  };

  return (
    <Card sx={{ height: 'auto', width: '100%', maxWidth: '350px', boxShadow: 'none', border: '1px solid #ddd', margin: '10px' }}>
      {/* Display the portfolio images in a carousel */}
      <Box sx={{ position: 'relative', width: '100%', height: 'auto', maxHeight: '230px', margin: 0 }}>
        <Slider {...sliderSettings}>
          {gig.portfolioImages && gig.portfolioImages.length > 0 ? (
            gig.portfolioImages.map((image, index) => (
              <CardMedia
                key={index}
                component="img"
                image={image}
                alt={`Portfolio Image ${index + 1}`}
                sx={{
                  width: '100%',
                  height: '230px',
                  objectFit: 'cover',
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

      {/* Seller Information and Flag */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 12px' }}>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <CardMedia
            component="img"
            image={gig.sellerProfilePicture}
            alt={gig.sellerDisplayName}
            sx={{ width: 32, height: 32, borderRadius: '50%', marginRight: '8px' }}
          />
          <Typography variant="h6" color="text.primary" sx={{ fontSize: '14px', fontWeight: 'bold' }}>
            {gig.sellerDisplayName}
          </Typography>
        </Box>
        {gig.countryImage && (
          <CardMedia
            component="img"
            image={gig.countryImage}
            alt="Country Flag"
            sx={{ width: 36, height: 24, borderRadius: '2px', marginLeft: '8px', objectFit: 'contain' }}  // Adjusted flag size and ensured no cut-off
          />
        )}
      </Box>

      <CardContent sx={{ padding: '8px 12px', marginTop: '0px' }}>
        <Tooltip title={<Typography sx={{ textAlign: 'left' }}>{gig.description}</Typography>} placement="bottom">
          <Typography variant="body2" color="text.secondary" sx={{ fontSize: '12px', textAlign: 'left', lineHeight: 1.4 }}>
            {shortenDescription(gig.description)}  {/* Shortened gig description */}
          </Typography>
        </Tooltip>

        {/* Price and Social Icons */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '10px' }}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Typography variant="body2" color="text.secondary" sx={{ fontSize: '12px', fontWeight: 'bold', marginRight: '8px' }}>
              S${gig.price} /hour  {/* Updated price display */}
            </Typography>
          </Box>

          <Box>
            {/* Instagram Icon */}
            {gig.sellerInstagram && (
              <IconButton component="a" href={formatLink(gig.sellerInstagram)} target="_blank" aria-label="Instagram" sx={{ padding: '4px' }}>
                <InstagramIcon sx={{ fontSize: '18px', color: '#666' }} />
              </IconButton>
            )}
            {/* Website Icon */}
            {gig.sellerWebsite && (
              <IconButton component="a" href={formatLink(gig.sellerWebsite)} target="_blank" aria-label="Website" sx={{ padding: '4px' }}>
                <LanguageIcon sx={{ fontSize: '18px', color: '#666' }} />
              </IconButton>
            )}
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
};

export default GigCard;
