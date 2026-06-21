import { Dimensions, PixelRatio, useWindowDimensions } from 'react-native';

export const widthPercentageToDP = (widthPercent: string | number): number => {
  const screenWidth = Dimensions.get('window').width;
  const elemWidth = typeof widthPercent === 'number' ? widthPercent : parseFloat(widthPercent);
  return PixelRatio.roundToNearestPixel((screenWidth * elemWidth) / 100);
};

export const heightPercentageToDP = (heightPercent: string | number): number => {
  const screenHeight = Dimensions.get('window').height;
  const elemHeight = typeof heightPercent === 'number' ? heightPercent : parseFloat(heightPercent);
  return PixelRatio.roundToNearestPixel((screenHeight * elemHeight) / 100);
};

// Shorthand aliases
export const wp = widthPercentageToDP;
export const hp = heightPercentageToDP;

/**
 * Hook that returns responsive width/height functions and dynamically updates on screen orientation change.
 */
export function useResponsive() {
  const { width, height } = useWindowDimensions();
  const shortDimension = width < height ? width : height;

  const dynamicWp = (widthPercent: string | number): number => {
    const elemWidth = typeof widthPercent === 'number' ? widthPercent : parseFloat(widthPercent);
    return PixelRatio.roundToNearestPixel((width * elemWidth) / 100);
  };

  const dynamicHp = (heightPercent: string | number): number => {
    const elemHeight = typeof heightPercent === 'number' ? heightPercent : parseFloat(heightPercent);
    return PixelRatio.roundToNearestPixel((height * elemHeight) / 100);
  };

  // Scales values relative to the smaller dimension of the device (stays stable when rotating)
  const scale = (percent: string | number): number => {
    const val = typeof percent === 'number' ? percent : parseFloat(percent);
    return PixelRatio.roundToNearestPixel((shortDimension * val) / 100);
  };

  return {
    wp: dynamicWp,
    hp: dynamicHp,
    scale,
    width,
    height,
    isLandscape: width > height,
  };
}
