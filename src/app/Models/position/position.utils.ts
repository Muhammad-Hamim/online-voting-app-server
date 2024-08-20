export const parseDuration = (duration: string): number => {
    const value = parseInt(duration);
    if (duration.endsWith("d")) {
      return value * 24 * 60 * 60 * 1000; // Convert days to milliseconds
    } else if (duration.endsWith("h")) {
      return value * 60 * 60 * 1000; // Convert hours to milliseconds
    } else if (duration.endsWith("m")) {
      return value * 60 * 1000; // Convert minutes to milliseconds
    } else {
      throw new Error("Invalid duration format");
    }
};
  