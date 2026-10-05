import {
  createContext,
  useContext,
  useState,
} from "react";

const CartContext =
  createContext();

export function CartProvider({
  children,
}) {

  const [cartItems, setCartItems] =
    useState([]);

  function addToCart(food) {

    setCartItems(
      (currentItems) => {

        const existingItem =
          currentItems.find(
            (item) =>
              item.id === food.id
          );

        if (existingItem) {

          return currentItems.map(
            (item) =>
              item.id === food.id
                ? {
                    ...item,
                    quantity:
                      item.quantity + 1,
                  }
                : item
          );

        }

        return [
          ...currentItems,

          {
            ...food,
            quantity: 1,
          },
        ];

      }
    );
  }

  function removeFromCart(
    foodId
  ) {

    setCartItems(
      (currentItems) =>
        currentItems.filter(
          (item) =>
            item.id !== foodId
        )
    );
  }

  function updateQuantity(
    foodId,
    quantity
  ) {

    if (quantity < 1) {
      return;
    }

    setCartItems(
      (currentItems) =>
        currentItems.map(
          (item) =>
            item.id === foodId
              ? {
                  ...item,
                  quantity:
                    quantity,
                }
              : item
        )
    );
  }

  function clearCart() {

    setCartItems([]);

  }

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {

  return useContext(
    CartContext
  );

}