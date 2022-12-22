import {signOut, useSession} from "next-auth/react";
import Head from "next/head";
import Link from "next/link";
import Cookies from "js-cookie";
import React, {useContext, useEffect, useState} from "react";
import {ToastContainer} from "react-toastify";
import {Menu} from "@headlessui/react";
import "react-toastify/dist/ReactToastify.css";
import {Store} from "../utils/Store";
import DropdownLink from "./DropdownLink";
import {useRouter} from "next/router";
import {MagnifyingGlassIcon, Bars3Icon, XMarkIcon} from "@heroicons/react/24/outline";
export default function Layout({title, children}) {
  const {status, data: session} = useSession();
  const {state, dispatch} = useContext(Store);
  const {cart} = state;
  const [cartItemsCount, setCartItemsCount] = useState(0);
  const [showCategories, setShowCategories] = useState(false);
  useEffect(() => {
    setCartItemsCount(cart.cartItems.reduce((a, c) => a + c.quantity, 0));
  }, [cart.cartItems]);

  const logoutClickHandler = () => {
    Cookies.remove("cart");
    dispatch({type: "CART_RESET"});
    signOut({callbackUrl: "/login"});
  };

  const [query, setQuery] = useState("");

  const router = useRouter();
  const submitHandler = (e) => {
    e.preventDefault();
    router.push(`/search?query=${query}`);
  };

  return (
    <>
      <Head>
        <title>GreenyFarm</title>
        <meta name="description" content="Ecommerce Website" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <ToastContainer position="bottom-center" limit={1} />

      <header className="fixed left-0 right-0 top-0 z-20 bg-white">
        {showCategories && (
          <div className="fixed z-50 top-0 left-0 bottom-0 right-0 bg-black/50 flex align-center justify-center">
            <XMarkIcon
              className="cursor-pointer text-white hover:text-rose-500 text-3xl absolute top-[40px] right-[40px] w-[40px] h-[40px] ease-linear duration-100"
              onClick={() => setShowCategories(!showCategories)}
            />
            <div className="flex flex-col justify-center align-center text-white text-2xl gap-4 text-center">
              <div className="text-4xl mb-8 font-bold text-lime-400">Categories</div>
              {/* Category */}
              <Link href="/search?category=meat" passHref>
                <div
                  className="cursor-pointer hover:text-emerald-400 ease-in duration-100 "
                  onClick={() => setShowCategories(!showCategories)}
                >
                  🥩 Meat
                </div>
              </Link>
              <Link href="/search?category=vegetables" passHref>
                <div
                  className="cursor-pointer hover:text-emerald-400 ease-in duration-100 "
                  onClick={() => setShowCategories(!showCategories)}
                >
                  🥕 Vegetables
                </div>
              </Link>
              <Link href="/search?category=dry-food" passHref>
                <div
                  className="cursor-pointer hover:text-emerald-400 ease-in duration-100 "
                  onClick={() => setShowCategories(!showCategories)}
                >
                  🌾 Dry Food
                </div>
              </Link>
            </div>
          </div>
        )}
        <nav className="flex h-12 items-center px-4 justify-between shadow-md">
          <div className="flex align-center justify-center gap-3">
            <div className="flex align-center justify-center">
              <Bars3Icon
                className="w-5 cursor-pointer"
                onClick={() => setShowCategories(!showCategories)}
              />
            </div>
            <Link href="/">
              <a className="text-lg font-bold text-emerald-400 hover:text-lime-500 ease-in duration-100">
                GreenyFarm
              </a>
            </Link>
          </div>
          <form onSubmit={submitHandler} className="mx-auto hidden w-full justify-center md:flex">
            <input
              onChange={(e) => setQuery(e.target.value)}
              type="text"
              className="rounded-tr-none rounded-br-none p-1 text-sm focus:ring-0 w-[300px] lg:w-[500px]"
              placeholder="Search products"
            />
            <button
              className="rounded rounded-tl-none rounded-bl-none bg-amber-300 p-1 text-sm dark:text-black"
              type="submit"
              id="button-addon2"
            >
              <MagnifyingGlassIcon className="h-5 w-5"></MagnifyingGlassIcon>
            </button>
          </form>
          <div>
            <Link href="/cart">
              <a className="p-2">
                Cart
                {cartItemsCount > 0 && (
                  <span className="ml-1 rounded-full bg-red-600 px-2 py-1 text-xs font-bold text-white">
                    {cartItemsCount}
                  </span>
                )}
              </a>
            </Link>

            {status === "loading" ? (
              "Loading"
            ) : session?.user ? (
              <Menu as="div" className="relative inline-block">
                <Menu.Button className="text-blue-600">{session.user.name}</Menu.Button>
                <Menu.Items className="absolute right-0 w-56 origin-top-right bg-white  shadow-lg ">
                  <Menu.Item>
                    <DropdownLink className="dropdown-link" href="/profile">
                      Profile
                    </DropdownLink>
                  </Menu.Item>
                  <Menu.Item>
                    <DropdownLink className="dropdown-link" href="/order-history">
                      Order History
                    </DropdownLink>
                  </Menu.Item>
                  {session.user.isAdmin && (
                    <Menu.Item>
                      <DropdownLink className="dropdown-link" href="/admin/dashboard">
                        Admin Dashboard
                      </DropdownLink>
                    </Menu.Item>
                  )}
                  <Menu.Item>
                    <a className="dropdown-link" href="#" onClick={logoutClickHandler}>
                      Logout
                    </a>
                  </Menu.Item>
                </Menu.Items>
              </Menu>
            ) : (
              <Link href="/login">
                <a className="p-2">Login</a>
              </Link>
            )}
          </div>
        </nav>
      </header>
      <div className="flex min-h-screen flex-col justify-between mt-12">
        <main className="container m-auto mt-4 px-4">{children}</main>
        <footer className="flex h-10 justify-center items-center shadow-inner">
          <p>TEAM BTT ❤️</p>
        </footer>
      </div>
    </>
  );
}
