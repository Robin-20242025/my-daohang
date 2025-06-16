import React, { useState, useEffect } from "react";
import Sidebar from "./components/Sidebar";
import NavList from "./components/NavList";
import AddForm from "./components/AddForm";
import GroupManager from "./components/GroupManager";
import BannerGallery from "./components/BannerGallery";
import SelectLinkModal from "./components/SelectLinkModal";
import SelectGroupModal from "./components/SelectGroupModal";

const LOCAL_KEY = "my_nav_data";

const defaultGroups = [
  { id: "g1", name: "AI工具" },
  { id: "g2", name: "设计" },
];

export default function App() {
  const [groups, setGroups] = useState([]);
  const [links, setLinks] = useState([]);
  const [currentGroup, setCurrentGroup] = useState("g1");
  // 编辑弹窗相关
  const [editing, setEditing] = useState(null); // {id, name, url, groupId}
  // 分组管理弹窗
  const [groupModal, setGroupModal] = useState({ visible: false, mode: '', group: null });
  // 添加网址弹窗
  const [addModal, setAddModal] = useState(false);
  // 添加菜单弹窗
  const [addMenu, setAddMenu] = useState(false);
  // 背景图片状态
  const [bgImg, setBgImg] = useState(null);
  // 横幅图片状态
  const [bannerImages, setBannerImages] = useState([]);
  // 横幅图片上传弹窗
  const [bannerUploadModal, setBannerUploadModal] = useState(false);
  // 网址选择弹窗状态
  const [selectLinkModal, setSelectLinkModal] = useState({ visible: false, mode: '', links: [] });
  // 选中的网址
  const [selectedLink, setSelectedLink] = useState(null);
  // 分组选择弹窗状态
  const [selectGroupModal, setSelectGroupModal] = useState({ visible: false, mode: '', groups: [] });
  // 选中的分组
  const [selectedGroup, setSelectedGroup] = useState(null);

  // 初始化加载本地数据
  useEffect(() => {
    const saved = localStorage.getItem(LOCAL_KEY);
    if (saved) {
      const data = JSON.parse(saved);
      setGroups(data.groups || defaultGroups);
      setLinks(data.links || []);
      setCurrentGroup(data.groups?.[0]?.id || "g1");
      setBannerImages(data.bannerImages || []);
    } else {
      setGroups(defaultGroups);
      setLinks([]);
      setCurrentGroup(defaultGroups[0].id);
      setBannerImages([]);
    }
  }, []);

  // 数据变化时保存到本地
  useEffect(() => {
    localStorage.setItem(LOCAL_KEY, JSON.stringify({ groups, links, bannerImages }));
  }, [groups, links, bannerImages]);

  // 自动获取网站logo
  function getFavicon(url) {
    try {
      const u = new URL(url);
      return `https://www.google.com/s2/favicons?sz=64&domain_url=${u.origin}`;
    } catch {
      return '';
    }
  }

  // 添加网址（弹窗模式）
  const handleAddLink = (link) => {
    const logo = getFavicon(link.url);
    setLinks([...links, { ...link, id: Date.now().toString(), logo }]);
    setAddModal(false);
  };

  // 删除网址
  const deleteLink = (id) => {
    setLinks(links.filter(link => link.id !== id));
  };

  // 切换分组
  const handleGroupChange = (groupId) => {
    setCurrentGroup(groupId);
  };

  // 当前分组下的网址
  const filteredLinks = links.filter(link => link.groupId === currentGroup);

  // 编辑网址
  const handleEdit = (link) => {
    setEditing(link);
  };
  // 保存编辑
  const handleEditSave = (newLink) => {
    const logo = getFavicon(newLink.url);
    setLinks(links.map(l => l.id === newLink.id ? { ...newLink, logo } : l));
    setEditing(null);
  };
  // 取消编辑
  const handleEditCancel = () => setEditing(null);

  // 分组管理相关
  const handleAddGroup = () => setGroupModal({ visible: true, mode: 'add', group: null });
  const handleEditGroup = (group) => setGroupModal({ visible: true, mode: 'edit', group });
  const handleDeleteGroup = (group) => setGroupModal({ visible: true, mode: 'delete', group });
  const closeGroupModal = () => setGroupModal({ visible: false, mode: '', group: null });

  const handleGroupModalOk = (value) => {
    if (groupModal.mode === 'add') {
      // 新分组ID
      const newId = 'g' + Date.now();
      setGroups([...groups, { id: newId, name: value }]);
      setCurrentGroup(newId);
    } else if (groupModal.mode === 'edit') {
      setGroups(groups.map(g => g.id === groupModal.group.id ? { ...g, name: value } : g));
    } else if (groupModal.mode === 'delete') {
      // 删除分组及其下所有网址
      setGroups(groups.filter(g => g.id !== groupModal.group.id));
      setLinks(links.filter(l => l.groupId !== groupModal.group.id));
      // 如果当前分组被删，切换到第一个分组
      if (currentGroup === groupModal.group.id) {
        const rest = groups.filter(g => g.id !== groupModal.group.id);
        setCurrentGroup(rest[0]?.id || '');
      }
    }
    closeGroupModal();
  };

  // 处理图片上传
  const handleBgImgChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (ev) => setBgImg(ev.target.result);
      reader.readAsDataURL(file);
    }
  };

  // 横幅图片上传处理
  const handleBannerUpload = (e) => {
    const files = Array.from(e.target.files);
    const readers = files.map(file => {
      return new Promise(resolve => {
        const reader = new FileReader();
        reader.onload = ev => resolve(ev.target.result);
        reader.readAsDataURL(file);
      });
    });
    Promise.all(readers).then(imgs => {
      setBannerImages([...bannerImages, ...imgs]);
      setBannerUploadModal(false);
    });
  };

  // 打开选择网址弹窗
  const openSelectLink = (mode) => {
    setSelectLinkModal({ visible: true, mode, links });
  };
  // 关闭选择网址弹窗
  const closeSelectLink = () => {
    setSelectLinkModal({ visible: false, mode: '', links: [] });
    setSelectedLink(null);
  };
  // 选择网址后操作
  const handleSelectLink = (link) => {
    setSelectedLink(link);
    setSelectLinkModal({ ...selectLinkModal, visible: false });
    if (selectLinkModal.mode === 'edit') setEditing(link);
    if (selectLinkModal.mode === 'delete') setTimeout(() => handleDeleteLinkConfirm(link), 200);
  };
  // 删除确认
  const handleDeleteLinkConfirm = (link) => {
    if (window.confirm(`确定要删除"${link.name}"吗？`)) {
      setLinks(links.filter(l => l.id !== link.id));
    }
    setSelectedLink(null);
  };

  // 打开选择分组弹窗
  const openSelectGroup = (mode) => {
    setSelectGroupModal({ visible: true, mode, groups });
  };
  // 关闭选择分组弹窗
  const closeSelectGroup = () => {
    setSelectGroupModal({ visible: false, mode: '', groups: [] });
    setSelectedGroup(null);
  };
  // 选择分组后操作
  const handleSelectGroup = (group) => {
    setSelectedGroup(group);
    setSelectGroupModal({ ...selectGroupModal, visible: false });
    if (selectGroupModal.mode === 'edit') setTimeout(() => handleEditGroup(group), 200);
    if (selectGroupModal.mode === 'delete') setTimeout(() => handleDeleteGroup(group), 200);
  };

  return (
    <div style={{ display: "flex", minHeight: "100vh" }}>
      <Sidebar
        groups={groups}
        currentGroup={currentGroup}
        onGroupChange={handleGroupChange}
        onAddGroup={handleAddGroup}
        onEditGroup={handleEditGroup}
        onDeleteGroup={handleDeleteGroup}
      />
      <main style={{
        flex: 1,
        padding: 32,
        minHeight: '100vh',
        background: bgImg ? `url(${bgImg}) center/cover no-repeat` : 'linear-gradient(135deg, #a1c4fd 0%, #c2e9fb 100%)',
        borderRadius: '24px 0 0 24px',
        boxShadow: '0 4px 32px 0 rgba(100,120,255,0.08)',
        margin: 24,
        overflowY: 'auto',
        transition: 'background 0.3s',
        position: 'relative'
      }}>
        {/* 横幅图片区 */}
        <BannerGallery images={bannerImages} />
        <NavList links={filteredLinks} />
        {/* 网址选择弹窗 */}
        <SelectLinkModal
          visible={selectLinkModal.visible}
          links={links}
          onSelect={handleSelectLink}
          onCancel={closeSelectLink}
        />
        {/* 分组选择弹窗 */}
        <SelectGroupModal
          visible={selectGroupModal.visible}
          groups={groups}
          onSelect={handleSelectGroup}
          onCancel={closeSelectGroup}
        />
        {editing && (
          <div style={{
            position: "fixed", left: 0, top: 0, width: "100vw", height: "100vh", background: "rgba(0,0,0,0.18)",
            display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000
          }}>
            <div style={{ background: "#fff", borderRadius: 10, padding: 32, minWidth: 340, boxShadow: "0 4px 24px #ddd" }}>
              <h3 style={{ marginBottom: 18 }}>编辑网址</h3>
              <AddForm
                onAdd={link => handleEditSave({ ...link, id: editing.id })}
                groups={groups}
                currentGroup={editing.groupId}
                initial={editing}
                editMode
              />
              <div style={{ textAlign: "right" }}>
                <button onClick={handleEditCancel} style={{ marginTop: 8, background: "#f5f6fa", color: "#888", border: "none", borderRadius: 4, padding: "6px 18px", cursor: "pointer" }}>取消</button>
              </div>
            </div>
          </div>
        )}
        {/* 添加网址弹窗 */}
        {addModal && (
          <div style={{
            position: "fixed", left: 0, top: 0, width: "100vw", height: "100vh", background: "rgba(0,0,0,0.18)",
            display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000
          }}>
            <div style={{ background: "#fff", borderRadius: 10, padding: 32, minWidth: 340, boxShadow: "0 4px 24px #ddd" }}>
              <h3 style={{ marginBottom: 18 }}>添加网址</h3>
              <AddForm
                onAdd={handleAddLink}
                groups={groups}
                currentGroup={currentGroup}
              />
              <div style={{ textAlign: "right" }}>
                <button onClick={() => setAddModal(false)} style={{ marginTop: 8, background: "#f5f6fa", color: "#888", border: "none", borderRadius: 4, padding: "6px 18px", cursor: "pointer" }}>取消</button>
              </div>
            </div>
          </div>
        )}
        {/* 分组管理弹窗 */}
        <GroupManager
          visible={groupModal.visible}
          mode={groupModal.mode}
          group={groupModal.group}
          onOk={handleGroupModalOk}
          onCancel={closeGroupModal}
        />
        {/* 左下角悬浮添加按钮和菜单 */}
        <div style={{ position: 'fixed', left: 36, bottom: 36, zIndex: 1200 }}>
          <button
            onClick={() => setAddMenu(v => !v)}
            style={{
              width: 56,
              height: 56,
              borderRadius: '50%',
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              color: '#fff',
              border: 'none',
              boxShadow: '0 4px 16px 0 rgba(100,120,255,0.18)',
              fontSize: 32,
              fontWeight: 700,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'box-shadow 0.2s',
            }}
            title="添加"
          >
            +
          </button>
          {addMenu && (
            <div style={{
              position: 'absolute',
              left: 0,
              bottom: 70,
              background: '#fff',
              borderRadius: 10,
              boxShadow: '0 4px 24px #ddd',
              minWidth: 120,
              padding: '8px 0',
              display: 'flex',
              flexDirection: 'column',
              gap: 2,
              animation: 'fadeIn .2s',
            }}>
              <button
                onClick={() => { setAddModal(true); setAddMenu(false); }}
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#333',
                  fontSize: 16,
                  padding: '10px 24px',
                  textAlign: 'left',
                  cursor: 'pointer',
                  width: '100%',
                  borderBottom: '1px solid #f0f0f0',
                }}
              >
                添加网址
              </button>
              <button
                onClick={() => { handleAddGroup(); setAddMenu(false); }}
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#333',
                  fontSize: 16,
                  padding: '10px 24px',
                  textAlign: 'left',
                  cursor: 'pointer',
                  width: '100%',
                  borderBottom: '1px solid #f0f0f0',
                }}
              >
                添加分组
              </button>
              <button
                onClick={() => { setBannerUploadModal(true); setAddMenu(false); }}
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#333',
                  fontSize: 16,
                  padding: '10px 24px',
                  textAlign: 'left',
                  cursor: 'pointer',
                  width: '100%',
                  borderBottom: '1px solid #f0f0f0',
                }}
              >
                上传横幅
              </button>
              <button
                onClick={() => { openSelectLink('edit'); setAddMenu(false); }}
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#333',
                  fontSize: 16,
                  padding: '10px 24px',
                  textAlign: 'left',
                  cursor: 'pointer',
                  width: '100%',
                  borderBottom: '1px solid #f0f0f0',
                }}
              >
                编辑网址
              </button>
              <button
                onClick={() => { openSelectLink('delete'); setAddMenu(false); }}
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#333',
                  fontSize: 16,
                  padding: '10px 24px',
                  textAlign: 'left',
                  cursor: 'pointer',
                  width: '100%',
                  borderBottom: '1px solid #f0f0f0',
                }}
              >
                删除网址
              </button>
              <button
                onClick={() => { openSelectGroup('edit'); setAddMenu(false); }}
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#333',
                  fontSize: 16,
                  padding: '10px 24px',
                  textAlign: 'left',
                  cursor: 'pointer',
                  width: '100%',
                  borderBottom: '1px solid #f0f0f0',
                }}
              >
                命名分组
              </button>
              <button
                onClick={() => { openSelectGroup('delete'); setAddMenu(false); }}
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#333',
                  fontSize: 16,
                  padding: '10px 24px',
                  textAlign: 'left',
                  cursor: 'pointer',
                  width: '100%',
                }}
              >
                删除分组
              </button>
            </div>
          )}
        </div>
        {/* 横幅图片上传弹窗 */}
        {bannerUploadModal && (
          <div style={{
            position: "fixed", left: 0, top: 0, width: "100vw", height: "100vh", background: "rgba(0,0,0,0.18)",
            display: "flex", alignItems: "center", justifyContent: "center", zIndex: 2000
          }}>
            <div style={{ background: "#fff", borderRadius: 10, padding: 32, minWidth: 340, boxShadow: "0 4px 24px #ddd" }}>
              <h3 style={{ marginBottom: 18 }}>上传横幅图片</h3>
              <input type="file" accept="image/*" multiple onChange={handleBannerUpload} />
              <div style={{ textAlign: "right" }}>
                <button onClick={() => setBannerUploadModal(false)} style={{ marginTop: 18, background: "#f5f6fa", color: "#888", border: "none", borderRadius: 4, padding: "6px 18px", cursor: "pointer" }}>取消</button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
} 