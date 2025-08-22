// Function to get the first line of content with ellipsis
export const getContentPreview = (content: string) => {
  if (!content) return "";

  // Split by newlines and get first line, then limit length
  const firstLine = content.split("\n")[0];
  const maxLength = 70; // Adjust this number based on your design needs

  if (firstLine.length > maxLength) {
    return firstLine.substring(0, maxLength).trim() + "......";
  }

  return firstLine + ".....";
};
