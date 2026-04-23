import React from "react";
import { useAuth } from "../contexts/AuthContext";
import { useTranslation } from "react-i18next";

const ProfilePage = () => {
  const { t } = useTranslation();
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-dark-100 to-gray-900">
      <div className="container mx-auto px-4 py-20">
        <h1 className="text-4xl font-bold mb-8 gradient-text">
          {t("profile.my_profile")}
        </h1>
        {user ? (
          <div className="bg-dark-200 rounded-xl p-8 max-w-2xl mx-auto">
            <div className="text-center mb-8">
              <div className="w-24 h-24 rounded-full bg-gradient-to-r from-primary-500 to-primary-600 flex items-center justify-center mx-auto text-3xl font-bold">
                {user.username?.[0]?.toUpperCase()}
              </div>
              <h2 className="text-2xl font-bold mt-4">{user.username}</h2>
              <p className="text-gray-400">{user.email}</p>
            </div>
            <div className="space-y-4">
              <div className="flex justify-between items-center py-3 border-b border-white/10">
                <span className="text-gray-300">{t("profile.role")}</span>
                <span className="capitalize">{user.role}</span>
              </div>
              <div className="flex justify-between items-center py-3 border-b border-white/10">
                <span className="text-gray-300">
                  {t("profile.member_since")}
                </span>
                <span>{new Date(user.createdAt).toLocaleDateString()}</span>
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center py-20">
            <p className="text-gray-400">{t("profile.please_login")}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfilePage;
