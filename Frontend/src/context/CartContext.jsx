// "use client";

// import { createContext, useContext, useState, useEffect } from "react";

// const CartContext = createContext();

// export const CartProvider = ({ children }) => {
//   const [cartItems, setCartItems] = useState([]);
//   const [cartUpdated, setCartUpdated] = useState(false);

//   // Load from localStorage on mount
//   useEffect(() => {
//     const stored = localStorage.getItem("cart");
//     if (stored) {
//       // Force price to ₹1 when loading
//       const parsed = JSON.parse(stored).map(item => ({ ...item, price: 1 }));
//       setCartItems(parsed);
//     }
//   }, []);

//   // Save to localStorage on change
//   useEffect(() => {
//     localStorage.setItem("cart", JSON.stringify(cartItems));
//   }, [cartItems]);

//   const addToCart = (product) => {
//     const productWithTestPrice = { ...product, price: 1 }; // force price to ₹1
//     setCartItems((prev) => {
//       const existing = prev.find((item) => item.id === productWithTestPrice.id);
//       if (existing) {
//         return prev.map((item) =>
//           item.id === productWithTestPrice.id
//             ? { ...item, quantity: item.quantity + 1 }
//             : item
//         );
//       } else {
//         return [...prev, { ...productWithTestPrice, quantity: 1 }];
//       }
//     });
//     setCartUpdated(true);
//   };

//   const removeFromCart = (id) => {
//     setCartItems((prev) => prev.filter((item) => item.id !== id));
//     setCartUpdated(true);
//   };

//   const incrementQuantity = (id) => {
//     setCartItems((prev) =>
//       prev.map((item) =>
//         item.id === id ? { ...item, quantity: item.quantity + 1 } : item
//       )
//     );
//     setCartUpdated(true);
//   };

//   const decrementQuantity = (id) => {
//     setCartItems((prev) =>
//       prev.map((item) =>
//         item.id === id && item.quantity > 1
//           ? { ...item, quantity: item.quantity - 1 }
//           : item
//       )
//     );
//     setCartUpdated(true);
//   };

//   const getCartTotal = () =>
//     cartItems.reduce((total, item) => total + item.price * item.quantity, 0);

//   const clearCart = () => {
//     setCartItems([]);
//     setCartUpdated(true);
//   };

//   return (
//     <CartContext.Provider
//       value={{
//         cart: cartItems,
//         addToCart,
//         removeFromCart,
//         incrementQuantity,
//         decrementQuantity,
//         getCartTotal,
//         clearCart,
//         cartUpdated,
//         setCartUpdated,
//       }}
//     >
//       {children}
//     </CartContext.Provider>
//   );
// };

// export const useCart = () => useContext(CartContext);







"use client";

import { createContext, useContext, useState, useEffect } from "react";

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const [cartUpdated, setCartUpdated] = useState(false);
  const [userId, setUserId] = useState(null);

  // Get user ID on mount and when auth changes
  useEffect(() => {
    const getUserId = () => {
      const user = localStorage.getItem("user");
      if (user) {
        try {
          const userData = JSON.parse(user);
          return userData.id || userData.email || "guest";
        } catch (e) {
          return "guest";
        }
      }
      return "guest";
    };

    const currentUserId = getUserId();
    setUserId(currentUserId);

    // Listen for auth changes
    const handleAuthChange = () => {
      const newUserId = getUserId();
      if (newUserId !== userId) {
        setUserId(newUserId);
      }
    };

    window.addEventListener("authChange", handleAuthChange);
    window.addEventListener("storage", handleAuthChange);

    return () => {
      window.removeEventListener("authChange", handleAuthChange);
      window.removeEventListener("storage", handleAuthChange);
    };
  }, [userId]);

  // Load from localStorage on mount and when userId changes
  useEffect(() => {
    if (userId) {
      const cartKey = `cart_${userId}`;
      const stored = localStorage.getItem(cartKey);
      if (stored) {
        setCartItems(JSON.parse(stored));
      } else {
        setCartItems([]);
      }
    }
  }, [userId]);

  // Save to localStorage on change and dispatch event
  useEffect(() => {
    if (userId) {
      const cartKey = `cart_${userId}`;
      localStorage.setItem(cartKey, JSON.stringify(cartItems));
      
      // Dispatch custom event to notify other components about cart changes
      window.dispatchEvent(new Event("cartChange"));
    }
  }, [cartItems, userId]);

  const addToCart = (product) => {
    setCartItems((prev) => {
      const existing = prev.find((item) => item.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      } else {
        return [...prev, { ...product, quantity: 1 }]; // ✅ keep product.price
      }
    });
    setCartUpdated(true);
  };

  const removeFromCart = (id) => {
    setCartItems((prev) => prev.filter((item) => item.id !== id));
    setCartUpdated(true);
  };

  const incrementQuantity = (id) => {
    setCartItems((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, quantity: item.quantity + 1 } : item
      )
    );
    setCartUpdated(true);
  };

  const decrementQuantity = (id) => {
    setCartItems((prev) =>
      prev.map((item) =>
        item.id === id && item.quantity > 1
          ? { ...item, quantity: item.quantity - 1 }
          : item
      )
    );
    setCartUpdated(true);
  };

  const getCartTotal = () =>
    cartItems.reduce((total, item) => total + item.price * item.quantity, 0);

  const clearCart = () => {
    setCartItems([]);
    setCartUpdated(true);
  };

  return (
    <CartContext.Provider
      value={{
        cart: cartItems,
        addToCart,
        removeFromCart,
        incrementQuantity,
        decrementQuantity,
        getCartTotal,
        clearCart,
        cartUpdated,
        setCartUpdated,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
