/* ========== 通义大模型生态赋能中心活动资讯 - 公共JS ========== */

// 数据管理模块
const EventManager = {
    STORAGE_KEY: 'tongyi_events',

    // 获取所有活动
    getAll() {
        const data = localStorage.getItem(this.STORAGE_KEY);
        return data ? JSON.parse(data) : [];
    },

    // 根据ID获取活动
    getById(id) {
        const events = this.getAll();
        return events.find(e => e.id === id);
    },

    // 添加活动
    add(event) {
        const events = this.getAll();
        event.id = Date.now().toString(36) + Math.random().toString(36).substr(2, 5);
        event.createTime = new Date().toISOString();
        events.unshift(event);
        localStorage.setItem(this.STORAGE_KEY, JSON.stringify(events));
        return event;
    },

    // 更新活动
    update(id, updatedData) {
        const events = this.getAll();
        const index = events.findIndex(e => e.id === id);
        if (index !== -1) {
            events[index] = { ...events[index], ...updatedData, updateTime: new Date().toISOString() };
            localStorage.setItem(this.STORAGE_KEY, JSON.stringify(events));
            return events[index];
        }
        return null;
    },

    // 删除活动
    delete(id) {
        let events = this.getAll();
        events = events.filter(e => e.id !== id);
        localStorage.setItem(this.STORAGE_KEY, JSON.stringify(events));
    },

    // 初始化示例数据
    initSampleData() {
        if (this.getAll().length === 0) {
            const sampleEvents = [
                {
                    id: 'sample1',
                    title: '通义千问大模型技术沙龙',
                    date: '2026-06-20',
                    time: '14:00',
                    location: '杭州·阿里巴巴西溪园区',
                    category: '技术沙龙',
                    status: 'active',
                    organizer: '通义大模型生态赋能中心',
                    description: '深入探讨通义千问大模型的最新技术突破，包括多模态理解、代码生成、数学推理等核心能力的提升。邀请核心研发团队分享技术细节和应用实践。\n\n活动议程：\n14:00-14:30 签到入场\n14:30-15:30 通义千问技术架构解析\n15:30-16:30 多模态能力演示与实战\n16:30-17:00 Q&A互动环节',
                    cover: '',
                    images: [],
                    createTime: '2026-06-01T10:00:00.000Z'
                },
                {
                    id: 'sample2',
                    title: 'AI赋能企业数字化转型峰会',
                    date: '2026-06-25',
                    time: '09:00',
                    location: '上海·世博中心',
                    category: '行业峰会',
                    status: 'active',
                    organizer: '通义大模型生态赋能中心',
                    description: '汇聚行业领袖，探讨大模型在企业数字化转型中的落地路径。涵盖智能客服、智能营销、智能办公等多个应用场景的实战经验分享。',
                    cover: '',
                    images: [],
                    createTime: '2026-06-02T10:00:00.000Z'
                },
                {
                    id: 'sample3',
                    title: '通义开发者训练营 - 第三期',
                    date: '2026-07-05',
                    time: '10:00',
                    location: '线上直播',
                    category: '培训课程',
                    status: 'active',
                    organizer: '通义大模型生态赋能中心',
                    description: '面向开发者的实战训练营，从零开始学习通义大模型API的接入与应用开发。包含Prompt工程、RAG检索增强、Agent开发等核心课程。',
                    cover: '',
                    images: [],
                    createTime: '2026-06-03T10:00:00.000Z'
                },
                {
                    id: 'sample4',
                    title: 'AIGC创意设计工作坊',
                    date: '2026-05-15',
                    time: '13:30',
                    location: '北京·中关村软件园',
                    category: '工作坊',
                    status: 'ended',
                    organizer: '通义大模型生态赋能中心',
                    description: '探索AI辅助创意设计的无限可能。通过通义万相等工具，体验AI生成图片、视频的魅力，学习如何将AI融入设计工作流。',
                    cover: '',
                    images: [],
                    createTime: '2026-05-10T10:00:00.000Z'
                }
            ];
            localStorage.setItem(this.STORAGE_KEY, JSON.stringify(sampleEvents));
        }
    }
};

// 工具函数
const Utils = {
    // 格式化日期
    formatDate(dateStr) {
        if (!dateStr) return '';
        const date = new Date(dateStr);
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    },

    // 获取URL参数
    getUrlParam(param) {
        const urlParams = new URLSearchParams(window.location.search);
        return urlParams.get(param);
    },

    // 显示提示消息
    showToast(message, type = 'success') {
        let toast = document.getElementById('toast');
        if (!toast) {
            toast = document.createElement('div');
            toast.id = 'toast';
            toast.className = 'toast';
            document.body.appendChild(toast);
        }
        toast.textContent = message;
        toast.className = `toast ${type}`;
        setTimeout(() => toast.classList.add('show'), 10);
        setTimeout(() => toast.classList.remove('show'), 3000);
    },

    // 图片转Base64
    fileToBase64(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => resolve(reader.result);
            reader.onerror = reject;
            reader.readAsDataURL(file);
        });
    },

    // 获取活动状态文本
    getStatusText(status) {
        const map = {
            'active': '报名中',
            'ended': '已结束',
            'upcoming': '即将开始'
        };
        return map[status] || status;
    },

    // 获取分类图标
    getCategoryIcon(category) {
        const icons = {
            '技术沙龙': '💡',
            '行业峰会': '🏛️',
            '培训课程': '📚',
            '工作坊': '🛠️',
            '线上直播': '📺',
            '其他': '📌'
        };
        return icons[category] || '📌';
    }
};

// 页面初始化
document.addEventListener('DOMContentLoaded', () => {
    EventManager.initSampleData();
});
