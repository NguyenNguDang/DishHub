export const isValidEmail = (email: string): boolean => {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
};

export const isValidPassword = (password: string): boolean => {
  return password.length >= 6;
};

export const isValidUsername = (username: string): boolean => {
  return username.length >= 3 && username.length <= 20;
};

export const validateRecipeForm = (recipe: {
  title: string;
  description: string;
  ingredients: unknown[];
}): string[] => {
  const errors: string[] = [];
  if (!recipe.title.trim()) errors.push('Tên công thức là bắt buộc');
  if (!recipe.description.trim()) errors.push('Mô tả là bắt buộc');
  if (!recipe.ingredients || recipe.ingredients.length === 0)
    errors.push('Phải có ít nhất một nguyên liệu');
  return errors;
};
