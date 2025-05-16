import React, { useState } from 'react';
import './styles.css'; // or use styled-components

const UserMenu = ({ user, onLogout }) => {

  return (
    <div className={`user-menu`}>
      <div className="user-header">
        <div>
          <div className="user-name">{user.name}</div>
          <button className="menu-item logout" onClick={onLogout}>
      Log Out
    </button>
        </div>
      </div>
    </div>
  );
};

export default UserMenu;