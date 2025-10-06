const $ = require('jquery');

import {
    hexPalette,
} from './config';
import camera from './camera';
import { generateTable } from './windows';
import Window from './Window'
import globals from './globals';
import me from './me';

// import userImg from '../img/user2.png';
import userImg from '../img/user.svg'
import { ROLE, ROLE_I } from './constants';
import IP from './utils/ip';
import { translate as t } from './translate';

import modBadge from '../img/mod-badge.svg'
import adminBadge from '../img/admin-badge.svg'
import creatorBadge from '../img/creator-badge.svg'
import { htmlspecialchars } from './utils/misc';
import { apiRequest } from './utils/api';

// WARNING: this will work only if file names are not changed by webpack
const requireBadge = require.context('../img/badges', false, /\.png$/);
const badgeLinks = {};
requireBadge.keys().map(requireBadge).forEach(path => {
    const filename = path.default.match(/([\w\d_]+)\.png$/);
    badgeLinks[filename[1]] = path.default;
});


const usersContainer = $('#usersTable');

export default class User {
    // create user window from given object
    // tempId is a temporary id for connection
    static async CreateWindow(info, tempId) {
        const win = new Window({
            center: true,
            title: `${info.name || t('PLAYER') + ' ' + (tempId || info.id)}`
        });

        // show everything by default
        const htmlInfo = new Map();

        if (info.registered) {
            htmlInfo.set('name', htmlspecialchars(info.name));
            htmlInfo.set('mail', htmlspecialchars(info.email));

        }

        htmlInfo.set('id', info.id||tempId);

        if (info.ip) {
            if (info.cc && info.cc !== 'XX') {
                // adds a flag near the ip address

                const cc = info.cc;
                htmlInfo.set('ip', info.ip + ` [${cc}]`);
                htmlInfo.set('ip', htmlInfo.get('ip') + `<img src="${location.protocol}//flagcdn.com/h20/${cc.toLowerCase()}.png" style="margin-left:1px;height:13px;">`);
            } else {
                htmlInfo.set('ip', info.ip);
            }
        }

        htmlInfo.set('role', info.role);

        // allowing role/badge change 
        if (info.role !== undefined && me.role === ROLE.ADMIN) {
            if (me.id !== info.id) {
                const role = info.role;
                let str = '';
                Object.keys(ROLE).forEach(text => {
                    str += `<option ${(text === role) ? 'selected' : ''}>${text}</option>`;
                })
                info.role = role ? ROLE[role] : null;

                htmlInfo.set('role', `<select type="role">${str}</select>`);
            }

            const badges = info.badges || [];
            requestAnimationFrame(() => {
                badges.forEach(badge => addBadge(badge.name));
            });

            let badgesCont = $(`<div class="badgesList"></div><button class="addBadgeBtn" title="Add Badge">+</button>`);
            htmlInfo.set('badges', badgesCont.map(function () {
                return this.outerHTML;
            }).get().join(''));
        }

        let infoArr = [...htmlInfo.keys(htmlInfo)].map(key => [key, htmlInfo.get(key)]), misc = [];
        infoArr = infoArr.filter(([k, v]) => !!v);

        if (me.role >= ROLE.MOD) {
            misc = [
                [`<input class="alertInput">`, `<button class="sendAlert">${t('btn.sendAlert')}</button>`],
                [`<input class="modalInput">`, `<button class="sendModal">${t('btn.sendModal')}</button>`],
                [`<input type="checkbox" id="${info.id}-shadow-cb" class="shadowCheckbox" ${info.shadowBanned ? 'checked' : ''}>`, `<label for="${info.id}-shadow-cb">${t('label.shadowBanned')}</label>`],
            ];
            // ip ban is only for guests
            if (!info.role && me.id !== info.id) {
                misc.push([`<button class="banByIp">${t('Ban by ip')}</button>`]);
            }
        }

        let together = infoArr.concat(misc);

        $(win.body).append(generateTable(together));

        $('select[type=role]', win.body).on('change', async e => {
            const role = e.target.value,
                userId = info.id;
            const resp = await fetch('/api/admin/changerole', {
                method: 'POST',
                body: JSON.stringify({
                    id: userId,
                    role
                }),
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            const body = await resp.json();
            if (body.errors) {
                body.errors.forEach(error => {
                    toastr.error(error, t('ERROR'));
                })
            } else {
                toastr.success(t('Changed role to') + ' ' + role);
            }
        })


        $('.sendAlert', win.body).on('click', () => {
            const val = $('.alertInput', win.body).val();

            if (val.length == 0) return;

            $('.alertInput', win.body).val('');
            globals.socket.sendAlert(tempId, val);
        });

        $('.sendModal', win.body).on('click', () => {
            const val = $('.modalInput', win.body).val();

            if (val.length == 0) return;

            $('.modalInput', win.body).val('');
            globals.socket.sendAlert(tempId, val, true);
        });

        $('.banByIp', win.body).on('click', async () => {
            const ip = info.ip;
            if (!ip) return toastr.error(t('No ip!'))

            const resp = await apiRequest(`/admin/banPlayer?ip=${ip}`);
            const success = (await resp.json()).success;
            if (success)
                toastr.success(t('Success'));
        });

        $('.shadowCheckbox', win.body).on('click', async e => {
            const checked = e.target.checked;
            const id = info.id;

            const resp = await apiRequest(`/admin/banPlayer/shadow?uid=${id}&banned=${checked}`, { method: 'POST' });
            const success = (await resp.json()).success;
            if (success)
                toastr.success(t('Success'));
        });

        $('.addBadgeBtn', win.body).on('click', async () => {
            const subwindow = new Window({
                title: 'Badges for ' + info.id,
                x: win.x + win.width + 5,
                y: win.y
            });
            if (!subwindow.created) return;

            subwindow.body.style.display = 'flex';
            subwindow.body.style.gap = '2px';

            for (const [badgeName, badgeLink] of Object.entries(badgeLinks)) {
                const badgeImg = $(`<div style="padding: 3px; background: gray; border-radius: 4px; max-width: fit-content;">
                <img src="${badgeLink}">
                </div>`);
                badgeImg.on('click', () => {
                    apiRequest(`/badges/add?userId=${info.id}&badge=${badgeName}`, { method: 'POST' }).then(async resp => {
                        if (!(await resp.json()).ok) return;

                        addBadge(badgeName);
                    });
                });
                $(subwindow.body).append(badgeImg);
            }
        });

        function addBadge(badgeName) {
            const badgeHtml = $(`<div class="badge" title="${badgeName}">
                            <img src="${badgeLinks[badgeName]}" alt="${badgeName}">
                        </div>`);
            $('.badgesList', win.body).append(badgeHtml);

            badgeHtml.on('click', () => {
                apiRequest(`/badges/del?userId=${info.id}&badge=${badgeName}`, { method: 'POST' }).then(async resp => {
                    if (!(await resp.json()).ok) return;

                    badgeHtml.remove();
                });
            });
        }
    }


    constructor(name, id, userId, registered, role, badges = null) {
        if (!name) name = 'ID ' + id;

        this.name = name;
        this.id = id;
        this.userId = userId;

        this.registered = registered;

        this.role = role;

        this.conns = [id];

        this.badges = badges;


        const safeName = htmlspecialchars(this.name);
        let displayName = globals.chat.parseColors(safeName).replace(/<[^>]*>/g, '');

        const roleBadgeProps = this.getRoleBadgeAndTitle();

        this.element = $(
            `<tr class="tableRow">
                <td title="id ${id}" class="user">
                    ${roleBadgeProps ? `<img src="${roleBadgeProps.icon}" title="${roleBadgeProps.tooltip}" class="roleBadge">` : ''}
                    <button class="userInfoBtn minrole-trusted"><img style="height: 20px" src="${userImg}"></button>
                    <span class="name">${displayName}</span>
                    <span class="badges"></span>
                    <span class="xConns"></span>
                </td>
                <td></td>
            </tr>`);

        this.nameEl = $('.name', this.element);
        this.coordsEl = $(this.element.children()[1]);

        this.nameEl.on('click', function () {
            const visibleNick = this.innerText;
            globals.elements.chatInput.value += visibleNick + ', ';
            globals.elements.chatInput.focus();
        })


        $('.userInfoBtn', this.element).on('click', async () => {
            const isReg = this.registered;
            const id = isReg ? this.userId : this.id;

            const req = await fetch(`/api/userInfo?id=${id}${isReg ? '' : '&unreg=1'}`);
            const info = await req.json();
            await User.CreateWindow(info, this.id);
        });

        this.coordsEl.on('click', () => {
            const [x, y] = this.coordsEl.text()
                .slice(1, -1)
                .split(', ')
                .map(x => parseInt(x, 10));

            if (Number.isInteger(x) && Number.isInteger(y)){
                camera.centerOn(x, y);
            }
        })

        usersContainer[0].appendChild(this.element[0]);

        me.updateRoleRelatedHtml();
    }

    async loadBadges() {
        if (this.userId === null) return;

        const resp = await apiRequest(`/userInfo/badges?id=${this.userId}`);
        const badges = await resp.json();
        this.badges = badges;
    }

    updateBadges() {
        $('.badges', this.element).append(this.getAchieveBadgesHtml());
    }

    getAchieveBadgesHtml() {
        if (!this.badges) return '';

        let html = '';
        for (let badge of this.badges) {
            const {
                name, width, height
            } = badge;

            const customWidth = width ? `width: ${width}px;` : '';
            const customHeight = height ? `height: ${height}px;` : '';

            html += `<img src="${badgeLinks[name]}" style="${customWidth}${customHeight}">`;
        }
        return html
    }

    getRoleBadgeAndTitle() {
        if (!this.role) return null;

        let tooltip, icon;

        switch (this.role) {
            case 'MOD':
                tooltip = 'mod';
                icon = modBadge;
                break
            case 'ADMIN':
                tooltip = 'admin';
                icon = adminBadge;
                break
            default:
                return null
        }

        // if (this.userId == 1) {
        //     tooltip = 'creator';
        //     icon = creatorBadge;
        // }

        return {
            tooltip,
            icon
        }
    }

    updateCoords(color, x, y) {
        this.coordsEl.css('color', hexPalette[color]);
        this.coordsEl.text(`(${x}, ${y})`);
    }

    close(clientId) {
        this.conns.splice(this.conns.indexOf(clientId), 1);
        if (this.conns.length === 0)
            this.destroy();
        else
            this.updateX();

        delete globals.users[clientId]
    }

    destroy() {
        this.element.remove();
    }

    newConnection(clientId) {
        this.conns.push(clientId);
        this.updateX();
    }

    updateX() {
        const text = (this.conns.length > 1) ? `[x${this.conns.length}]` : '';
        $('.xConns', this.element).text(text);
    }
}