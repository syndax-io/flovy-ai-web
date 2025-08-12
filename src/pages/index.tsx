"use client";

import { useEffect } from "react";

import { useRouter } from "next/router";
import Head from "next/head";
import Logo from "../components/web/Logo";
import FlovySlogan from "../components/app/FlovySlogan";
import DevLoginButton from "../components/web/DevLoginButton";
import ThemeToggle from "../components/web/ThemeToggle";

import { useAuth } from "../contexts/AuthContext";

export default function Home() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && user) {
      router.push("/dashboard");
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f9f9f9] dark:bg-[#00001a]">
        {" "}
        <div className="text-center">
          {" "}
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#0d7ff2] mx-auto"></div>{" "}
          <p className="mt-4 text-[#637488] dark:text-gray-400">Loading...</p>{" "}
        </div>{" "}
      </div>
    );
  }

  return (
    <div className="relative flex size-full min-h-screen flex-col overflow-x-hidden bg-[#f9f9f9] dark:bg-[#00001a]">
      {" "}
      <Head>
        {" "}
        <link
          href="https://fonts.googleapis.com/icon?family=Material+Icons"
          rel="stylesheet"
        />{" "}
      </Head>{" "}
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 shadow-md py-4 px-6 flex justify-between items-center sticky top-0 z-50">
        {" "}
        <Logo width={30} height={30} />{" "}
        <nav className="hidden md:flex flex-1 justify-center">
          {" "}
          <div className="flex space-x-8">
            {" "}
            <a
              className="text-[#637488] dark:text-gray-300 hover:text-[#0d7ff2] dark:hover:text-blue-400 font-medium transition-colors"
              href="#"
            >
              {" "}
              Product{" "}
            </a>{" "}
            <a
              className="text-[#637488] dark:text-gray-300 hover:text-[#0d7ff2] dark:hover:text-blue-400 font-medium transition-colors"
              href="#"
            >
              {" "}
              Pricing{" "}
            </a>{" "}
            <a
              className="text-[#637488] dark:text-gray-300 hover:text-[#0d7ff2] dark:hover:text-blue-400 font-medium transition-colors"
              href="#"
            >
              {" "}
              Resources{" "}
            </a>{" "}
            <a
              className="text-[#637488] dark:text-gray-300 hover:text-[#0d7ff2] dark:hover:text-blue-400 font-medium transition-colors"
              href="#"
            >
              {" "}
              About{" "}
            </a>{" "}
          </div>{" "}
        </nav>{" "}
        <div className="flex items-center gap-4">
          {" "}
          <ThemeToggle />{" "}
          <button className="bg-[#0d7ff2] text-white rounded-lg px-6 py-3 font-semibold hover:saturate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition-transform transform hover:scale-105">
            {" "}
            Join Waitlist{" "}
          </button>{" "}
        </div>{" "}
      </header>{" "}
      <main className="px-4 py-8">
        {" "}
        {/* Hero Section */}
        <section className="py-24 md:py-32">
          {" "}
          <div className="container mx-auto px-6 text-center">
            {" "}
            {/* Dynamic Slogan Component */}
            <div className="mb-8">
              {" "}
              <FlovySlogan />{" "}
            </div>{" "}
            <p className="mt-6 max-w-2xl mx-auto text-lg text-gray-600 dark:text-gray-300">
              {" "}
              Flovy is your one-stop AI workspace to organize, plan, and execute
              tasks across all your tools without switching context.{" "}
            </p>{" "}
            <div className="mt-10">
              {" "}
              <button className="bg-indigo-500 text-white font-semibold px-8 py-4 rounded-lg hover:bg-indigo-600 transition duration-300 text-lg">
                {" "}
                Join Waitlist{" "}
              </button>{" "}
            </div>{" "}
          </div>{" "}
        </section>{" "}
        {/* Unlock Seamless Productivity Section */}
        <section className="py-20 bg-gray-50 dark:bg-gray-900">
          {" "}
          <div className="container mx-auto px-6">
            {" "}
            <div className="text-center mb-16">
              {" "}
              <h2 className="text-4xl font-bold text-gray-900 dark:text-white">
                {" "}
                Unlock Seamless Productivity{" "}
              </h2>{" "}
              <p className="mt-4 text-lg text-gray-600 dark:text-gray-300">
                {" "}
                Integrate your favorite tools and let Flovy handle the rest.{" "}
              </p>{" "}
            </div>{" "}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
              {" "}
              <div className="text-center p-8 bg-white dark:bg-gray-800 rounded-xl shadow-md transition transform hover:-translate-y-2">
                {" "}
                <div className="flex items-center justify-center h-16 w-16 rounded-full bg-indigo-100 dark:bg-indigo-900 mx-auto mb-6">
                  {" "}
                  <span className="material-icons text-indigo-500 dark:text-indigo-400 text-3xl">
                    {" "}
                    calendar_today{" "}
                  </span>{" "}
                </div>{" "}
                <h3 className="text-2xl font-semibold text-gray-900 dark:text-white mb-3">
                  {" "}
                  Calendar Integration{" "}
                </h3>{" "}
                <p className="text-gray-600 dark:text-gray-300">
                  {" "}
                  Connect your calendar to effortlessly manage appointments and
                  deadlines.{" "}
                </p>{" "}
              </div>{" "}
              <div className="text-center p-8 bg-white dark:bg-gray-800 rounded-xl shadow-md transition transform hover:-translate-y-2">
                {" "}
                <div className="flex items-center justify-center h-16 w-16 rounded-full bg-indigo-100 dark:bg-indigo-900 mx-auto mb-6">
                  {" "}
                  <span className="material-icons text-indigo-500 dark:text-indigo-400 text-3xl">
                    {" "}
                    task_alt{" "}
                  </span>{" "}
                </div>{" "}
                <h3 className="text-2xl font-semibold text-gray-900 dark:text-white mb-3">
                  {" "}
                  Goal & Priority Tracking{" "}
                </h3>{" "}
                <p className="text-gray-600 dark:text-gray-300">
                  {" "}
                  Define and track your goals with built-in tools for detailed
                  planning.{" "}
                </p>{" "}
              </div>{" "}
              <div className="text-center p-8 bg-white dark:bg-gray-800 rounded-xl shadow-md transition transform hover:-translate-y-2">
                {" "}
                <div className="flex items-center justify-center h-16 w-16 rounded-full bg-indigo-100 dark:bg-indigo-900 mx-auto mb-6">
                  {" "}
                  <span className="material-icons text-indigo-500 dark:text-indigo-400 text-3xl">
                    {" "}
                    integration_instructions{" "}
                  </span>{" "}
                </div>{" "}
                <h3 className="text-2xl font-semibold text-gray-900 dark:text-white mb-3">
                  {" "}
                  Deep Integrations{" "}
                </h3>{" "}
                <p className="text-gray-600 dark:text-gray-300">
                  {" "}
                  Connect with Notion, Google Drive, and more for a unified
                  workflow.{" "}
                </p>{" "}
              </div>{" "}
            </div>{" "}
          </div>{" "}
        </section>{" "}
        {/* For Busy Professionals & CEOs Section */}
        <section className="py-20 bg-white dark:bg-gray-800">
          {" "}
          <div className="container mx-auto px-6">
            {" "}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
              {" "}
              <div>
                {" "}
                <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">
                  {" "}
                  For Busy Professionals & CEOs{" "}
                </h2>{" "}
                <ul className="space-y-4">
                  {" "}
                  <li className="flex items-start">
                    {" "}
                    <span className="material-icons text-green-500 mr-3 mt-1">
                      {" "}
                      check_circle{" "}
                    </span>{" "}
                    <div>
                      {" "}
                      <h4 className="font-semibold text-lg text-gray-900 dark:text-white">
                        {" "}
                        Enhanced Time Management{" "}
                      </h4>{" "}
                      <p className="text-gray-600 dark:text-gray-300">
                        {" "}
                        Automate scheduling and prioritize tasks effectively.{" "}
                      </p>{" "}
                    </div>{" "}
                  </li>{" "}
                  <li className="flex items-start">
                    {" "}
                    <span className="material-icons text-green-500 mr-3 mt-1">
                      {" "}
                      check_circle{" "}
                    </span>{" "}
                    <div>
                      {" "}
                      <h4 className="font-semibold text-lg text-gray-900 dark:text-white">
                        {" "}
                        Clear Goal Setting{" "}
                      </h4>{" "}
                      <p className="text-gray-600 dark:text-gray-300">
                        {" "}
                        Align daily actions with strategic objectives.{" "}
                      </p>{" "}
                    </div>{" "}
                  </li>{" "}
                  <li className="flex items-start">
                    {" "}
                    <span className="material-icons text-green-500 mr-3 mt-1">
                      {" "}
                      check_circle{" "}
                    </span>{" "}
                    <div>
                      {" "}
                      <h4 className="font-semibold text-lg text-gray-900 dark:text-white">
                        {" "}
                        Improved Productivity{" "}
                      </h4>{" "}
                      <p className="text-gray-600 dark:text-gray-300">
                        {" "}
                        Focus on high-impact work that moves the needle.{" "}
                      </p>{" "}
                    </div>{" "}
                  </li>{" "}
                </ul>{" "}
              </div>{" "}
              <div>
                {" "}
                <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">
                  {" "}
                  For Ambitious Students{" "}
                </h2>{" "}
                <ul className="space-y-4">
                  {" "}
                  <li className="flex items-start">
                    {" "}
                    <span className="material-icons text-green-500 mr-3 mt-1">
                      {" "}
                      check_circle{" "}
                    </span>{" "}
                    <div>
                      {" "}
                      <h4 className="font-semibold text-lg text-gray-900 dark:text-white">
                        {" "}
                        Organized Study Schedule{" "}
                      </h4>{" "}
                      <p className="text-gray-600 dark:text-gray-300">
                        {" "}
                        Balance coursework and manage deadlines with ease.{" "}
                      </p>{" "}
                    </div>{" "}
                  </li>{" "}
                  <li className="flex items-start">
                    {" "}
                    <span className="material-icons text-green-500 mr-3 mt-1">
                      {" "}
                      check_circle{" "}
                    </span>{" "}
                    <div>
                      {" "}
                      <h4 className="font-semibold text-lg text-gray-900 dark:text-white">
                        {" "}
                        Efficient Note-Taking{" "}
                      </h4>{" "}
                      <p className="text-gray-600 dark:text-gray-300">
                        {" "}
                        Keep your notes structured, organized, and accessible.{" "}
                      </p>{" "}
                    </div>{" "}
                  </li>{" "}
                  <li className="flex items-start">
                    {" "}
                    <span className="material-icons text-green-500 mr-3 mt-1">
                      {" "}
                      check_circle{" "}
                    </span>{" "}
                    <div>
                      {" "}
                      <h4 className="font-semibold text-lg text-gray-900 dark:text-white">
                        {" "}
                        Academic Success{" "}
                      </h4>{" "}
                      <p className="text-gray-600 dark:text-gray-300">
                        {" "}
                        Build habits that will prepare you for your future
                        career.{" "}
                      </p>{" "}
                    </div>{" "}
                  </li>{" "}
                </ul>{" "}
              </div>{" "}
            </div>{" "}
          </div>{" "}
        </section>{" "}
        {/* Ready to Focus Section */}
        <section className="bg-gray-50 dark:bg-gray-900">
          {" "}
          <div className="container mx-auto px-6 py-20 text-center">
            {" "}
            <h2 className="text-4xl font-bold text-gray-900 dark:text-white">
              {" "}
              Ready to Focus on What Matters?{" "}
            </h2>{" "}
            <p className="mt-4 max-w-2xl mx-auto text-lg text-gray-600 dark:text-gray-300">
              {" "}
              Join Flovy today and take control of your time and priorities.
              Unlock your full potential.{" "}
            </p>{" "}
            <div className="mt-8">
              {" "}
              <button className="bg-indigo-500 text-white font-semibold px-6 py-3 rounded-lg hover:bg-indigo-600 transition duration-300">
                {" "}
                Join Waitlist{" "}
              </button>{" "}
            </div>{" "}
          </div>{" "}
        </section>{" "}
      </main>{" "}
      {/* Footer */}
      <footer className="bg-white dark:bg-gray-800 py-10 mt-12 border-t border-gray-200 dark:border-gray-700">
        {" "}
        <div className="container mx-auto px-4 text-center">
          {" "}
          <div className="flex flex-wrap items-center justify-center gap-6 mb-6">
            {" "}
            <a
              className="text-[#637488] dark:text-gray-300 hover:text-[#0d7ff2] dark:hover:text-blue-400 font-medium transition-colors"
              href="#"
            >
              {" "}
              Product{" "}
            </a>{" "}
            <a
              className="text-[#637488] dark:text-gray-300 hover:text-[#0d7ff2] dark:hover:text-blue-400 font-medium transition-colors"
              href="#"
            >
              {" "}
              Pricing{" "}
            </a>{" "}
            <a
              className="text-[#637488] dark:text-gray-300 hover:text-[#0d7ff2] dark:hover:text-blue-400 font-medium transition-colors"
              href="#"
            >
              {" "}
              Resources{" "}
            </a>{" "}
            <a
              className="text-[#637488] dark:text-gray-300 hover:text-[#0d7ff2] dark:hover:text-blue-400 font-medium transition-colors"
              href="#"
            >
              {" "}
              Contact{" "}
            </a>{" "}
          </div>{" "}
          <p className="text-[#637488] dark:text-gray-400">
            {" "}
            © 2025 Flovy.ai. All rights reserved.{" "}
          </p>{" "}
        </div>{" "}
      </footer>{" "}
      {/* Development Login Button - Only visible in dev mode */}
      <DevLoginButton />{" "}
    </div>
  );
}
