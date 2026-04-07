import type { Recipe } from '../types';

/**
 * Mock data cho testing khi backend chưa sẵn sàng
 * Có thể import từ đây và sử dụng trong API client
 */

export const MOCK_RECIPES: Recipe[] = [
  {
    id: '1',
    title: 'Pasta Carbonara',
    description: 'Mỳ ý truyền thống với trứng, phô mai và thịt lợn muối. Đây là một trong những công thức cơ bản nhất của nước Ý.',
    image: 'https://images.unsplash.com/photo-1621996346565-e3dbc646d9a9?w=500&h=500&fit=crop',
    cookTime: 15,
    prepTime: 10,
    servings: 4,
    difficulty: 'easy',
    category: 'lunch',
    tags: ['italian', 'pasta', 'quick', 'dinner'],
    rating: 4.8,
    reviews: 234,
    ingredients: [
      { id: '1', name: 'Pasta spaghetti', quantity: 400, unit: 'g' },
      { id: '2', name: 'Bacon', quantity: 200, unit: 'g' },
      { id: '3', name: 'Trứng gà', quantity: 3, unit: 'piece' },
      { id: '4', name: 'Phô mai Parmesan', quantity: 100, unit: 'g' },
      { id: '5', name: 'Tiêu đen', quantity: 1, unit: 'tbsp' },
      { id: '6', name: 'Muối', quantity: 1, unit: 'tbsp' },
    ],
    instructions: [
      'Đun nước muối sôi, thêm mỳ spaghetti vào',
      'Xào bacon cho đến khi giòn, để nguội',
      'Trộn trứng với phô mai Parmesan và tiêu',
      'Khi mỳ chín, xả nước nhưng giữ lại một chút nước mỳ',
      'Thêm mỳ vào bacon, rồi rút bỏ khỏi lửa',
      'Đổ hỗn hợp trứng vào, trộn nhanh',
      'Thêm muối và tiêu nếu cần, phục vụ ngay lập tức',
    ],
    createdBy: 'chef_marco',
    createdAt: new Date('2026-01-15'),
    updatedAt: new Date('2026-02-20'),
  },
  {
    id: '2',
    title: 'Phở Việt Nam',
    description: 'Món phở truyền thống Việt Nam với nước dùng thơm, mỳ mềm và thịt bò tươi ngon.',
    image: 'https://images.unsplash.com/photo-1621996346565-e3dbc646d9a9?w=500&h=500&fit=crop',
    cookTime: 120,
    prepTime: 30,
    servings: 4,
    difficulty: 'hard',
    category: 'lunch',
    tags: ['vietnamese', 'soup', 'beef', 'traditional'],
    rating: 4.9,
    reviews: 567,
    ingredients: [
      { id: '1', name: 'Thịt bò (xương)', quantity: 1000, unit: 'g' },
      { id: '2', name: 'Mỳ phở', quantity: 400, unit: 'g' },
      { id: '3', name: 'Hành tây', quantity: 200, unit: 'g' },
      { id: '4', name: 'Gừng', quantity: 50, unit: 'g' },
      { id: '5', name: 'Quế', quantity: 1, unit: 'piece' },
      { id: '6', name: 'Anise sao', quantity: 3, unit: 'piece' },
      { id: '7', name: 'Thịt bò thái lát', quantity: 400, unit: 'g' },
      { id: '8', name: 'Tương cà chua', quantity: 2, unit: 'tbsp' },
    ],
    instructions: [
      'Rửa sạch xương bò, nấu sôi lấy nước',
      'Hành và gừng nướng cho thơm, thêm vào nước dùng',
      'Nấu chậm 2 giờ với quế và anise sao',
      'Lọc nước dùng, nêm ướp vừa miệng',
      'Luộc mỳ phở cho đến khi chín',
      'Xếp mỳ vào tô, thêm thịt bò, đổ nước dùng nóng',
      'Ăn kèm với rau sống và tương cà chua',
    ],
    createdBy: 'chef_linh',
    createdAt: new Date('2026-01-10'),
    updatedAt: new Date('2026-02-18'),
  },
  {
    id: '3',
    title: 'Bánh Mì Sandwich',
    description: 'Bánh mì Việt Nam với bơ, pâté, thịt lợn và rau tươi. Một món ăn nhanh nhưng ngon miệng.',
    image: 'https://images.unsplash.com/photo-1553909764-5a6a9f592fa8?w=500&h=500&fit=crop',
    cookTime: 10,
    prepTime: 15,
    servings: 2,
    difficulty: 'easy',
    category: 'breakfast',
    tags: ['vietnamese', 'sandwich', 'quick', 'street-food'],
    rating: 4.6,
    reviews: 345,
    ingredients: [
      { id: '1', name: 'Bánh mì', quantity: 1, unit: 'piece' },
      { id: '2', name: 'Bơ', quantity: 2, unit: 'tbsp' },
      { id: '3', name: 'Pâté', quantity: 100, unit: 'g' },
      { id: '4', name: 'Thịt lợn xá xị', quantity: 100, unit: 'g' },
      { id: '5', name: 'Cà chua', quantity: 1, unit: 'piece' },
      { id: '6', name: 'Dưa chuột', quantity: 1, unit: 'piece' },
      { id: '7', name: 'Hành lá', quantity: 20, unit: 'g' },
      { id: '8', name: 'Ớt', quantity: 1, unit: 'piece' },
    ],
    instructions: [
      'Cắt bánh mì dọc, nướng nhẹ',
      'Thoa bơ và pâté vào bánh',
      'Xếp thịt lợn, cà chua, dưa chuột',
      'Rắc hành lá, ớt và các gia vị yêu thích',
      'Cắt đôi và ăn ngay',
    ],
    createdBy: 'chef_hung',
    createdAt: new Date('2026-01-20'),
    updatedAt: new Date('2026-02-15'),
  },
  {
    id: '4',
    title: 'Tom Yum Goong (Tôm Chua Cay)',
    description: 'Canh tôm chua cay nổi tiếng của Thái Lan với vị chua, cay và thơm đặc trưng.',
    image: 'https://images.unsplash.com/photo-1568123644529-ae4efef290d9?w=500&h=500&fit=crop',
    cookTime: 30,
    prepTime: 20,
    servings: 4,
    difficulty: 'medium',
    category: 'lunch',
    tags: ['thai', 'soup', 'shrimp', 'spicy'],
    rating: 4.7,
    reviews: 289,
    ingredients: [
      { id: '1', name: 'Tôm tươi', quantity: 600, unit: 'g' },
      { id: '2', name: 'Nước cốt dừa', quantity: 400, unit: 'ml' },
      { id: '3', name: 'Nước cơm', quantity: 1000, unit: 'ml' },
      { id: '4', name: 'Ớt đỏ', quantity: 4, unit: 'piece' },
      { id: '5', name: 'Chanh', quantity: 2, unit: 'piece' },
      { id: '6', name: 'Sả', quantity: 3, unit: 'piece' },
      { id: '7', name: 'Nấm Kim Chi', quantity: 200, unit: 'g' },
      { id: '8', name: 'Hành tây', quantity: 1, unit: 'piece' },
    ],
    instructions: [
      'Đun sôi nước cốm, thêm sả, ớt, hành',
      'Nấu nhỏ lửa 15 phút để lấy vị',
      'Thêm nước cốt dừa, nấu thêm 5 phút',
      'Thêm tôm vào, nấu khi tôm chuyển màu',
      'Nêm nước mắm, nước chanh vừa miệng',
      'Thêm nấm Kim Chi trước khi ăn',
      'Phục vụ nóng',
    ],
    createdBy: 'chef_somchai',
    createdAt: new Date('2026-01-25'),
    updatedAt: new Date('2026-02-22'),
  },
  {
    id: '5',
    title: 'Spaghetti Bolognese',
    description: 'Mỳ Ý với nước sốt thịt bò cà chua ngon tuyệt vời, công thức Ý truyền thống.',
    image: 'https://images.unsplash.com/photo-1599927506081-dc418263529d?w=500&h=500&fit=crop',
    cookTime: 45,
    prepTime: 15,
    servings: 4,
    difficulty: 'medium',
    category: 'dinner',
    tags: ['italian', 'pasta', 'meat', 'sauce'],
    rating: 4.5,
    reviews: 421,
    ingredients: [
      { id: '1', name: 'Spaghetti', quantity: 400, unit: 'g' },
      { id: '2', name: 'Thịt bò xay', quantity: 500, unit: 'g' },
      { id: '3', name: 'Cà chua tươi', quantity: 800, unit: 'g' },
      { id: '4', name: 'Hành tây', quantity: 1, unit: 'piece' },
      { id: '5', name: 'Tỏi', quantity: 4, unit: 'clove' },
      { id: '6', name: 'Dầu olive', quantity: 3, unit: 'tbsp' },
      { id: '7', name: 'Thảo dược Ý', quantity: 1, unit: 'tbsp' },
      { id: '8', name: 'Phô mai Parmesan', quantity: 100, unit: 'g' },
    ],
    instructions: [
      'Cắt hành tây và tỏi nhỏ',
      'Xào hành tây và tỏi trong dầu olive',
      'Thêm thịt bò xay, xào chín',
      'Thêm cà chua, thảo dược Ý, nấu 30 phút',
      'Đun nước muối sôi, nấu spaghetti',
      'Xả mỳ, trộn với sốt',
      'Rắc phô mai Parmesan, phục vụ',
    ],
    createdBy: 'chef_giuseppe',
    createdAt: new Date('2026-02-01'),
    updatedAt: new Date('2026-02-25'),
  },
];

/**
 * Mock function để lấy danh sách công thức
 * Dùng cho testing trước khi có backend
 */
export const getMockRecipes = (): Promise<Recipe[]> => {
  return new Promise((resolve) => {
    setTimeout(() => resolve(MOCK_RECIPES), 500);
  });
};

/**
 * Mock function để lấy công thức theo ID
 */
export const getMockRecipeById = (id: string): Promise<Recipe | null> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const recipe = MOCK_RECIPES.find((r) => r.id === id);
      resolve(recipe || null);
    }, 300);
  });
};

/**
 * Mock function để tìm kiếm công thức
 */
export const searchMockRecipes = (query: string): Promise<Recipe[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const results = MOCK_RECIPES.filter((r) =>
        r.title.toLowerCase().includes(query.toLowerCase()) ||
        r.description.toLowerCase().includes(query.toLowerCase())
      );
      resolve(results);
    }, 300);
  });
};

