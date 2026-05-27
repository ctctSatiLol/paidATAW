(function() {
    if(!window.localStorage.notFirstUse) {
        alert(`Welcome to ATAW! The owner is 10 now`); /* on 22/5/2026 */
        alert(`Try typing a link in the input! Remember to add https://`);
        alert(`type /cmds for all commands`);
        window.localStorage.notFirstUse = `true`;
    }
    if(!window.localStorage.atawKey) {
        let inp = prompt(`whats the key? [REQUIRED]`);
        if((Number(
               `${Number(`0x${inp}`)}`
                   .replaceAll(/2|5|7/g, ``)
          ) % 10) !== 0) return;
        else window.localStorage.atawKey = inp;
    }
    let defaultCommands = new Set([
        `/cr`, `/rl`, `/sh`, `/hs`, `/m`, `/nh`, `/bp`, `/re`, `/n`, `/r`, `/cmds`, `/tc`, `/tr`, `/bk`, `/br`, 
        `/bc`, `/s`, `/cc`
    ]);
    let links = new Set([
        `https://bloxd.io`,
        `https://poxel.io`
    ]);
    let defaultSettings = {
        hideTime: 30000, /* counts in ms */
        trigColor: `rgba(255, 0, 0, 0.3)`
    };
    let cmdTeach = [
        `try /tr 0.5`, `do /rl to reload`, `do /sh to copy game link`, `/hs to hide input`, `/m is a calc`, `/nh lets u set no hide sessions`, `/bp lets u copy all settings`, `/re to restore settings from /bp`, `/n for notes`, `/cmds to see all cmds`, `/bk to add bookmark`, `/br to remove bookmark`, `/bc to clear all bookmarks`, `/s for settings`, `/cc to make custom commands`
    ];
    let commands = window.localStorage.commands ? JSON.parse(window.localStorage.commands) : {};
    let scriptCommands = window.localStorage.scriptCommands ? JSON.parse(window.localStorage.scriptCommands) : {};
    let settings = window.localStorage.settings ? JSON.parse(window.localStorage.settings) : defaultSettings;
    if(!window.localStorage.settings) window.localStorage.settings = JSON.stringify(defaultSettings);
    let lastUsedCommand = ``;
    const toSpecialCode = text => 
        text.substring(11, text.length)
            .replace(/\bconsole\.log\b/g, `window.log`)
            .replace(/\bconsole\.warn\b/g, `window.warn`)
            .replace(/\bconsole\.error\b/g, `window.error`)
            .replace(/\bconsole\.table\b/g, `window.table`);
    const password = `696969*`;
    const linkRegex = /^https:\/\//;
    const cmdRegex = /^\//;
    const linkCmdRegex = /^https:\/\/[a-zA-Z0-9_.]+\s\/.+/;
    const ifr = document.createElement(`iframe`);
    const linkIn = document.createElement(`input`);
    const trig = document.createElement(`div`);
    const cnsl = document.createElement(`p`);
    const ifrContainer = document.createElement(`div`);
    let prevLPTimeout;
    let loadTimeout;
    let isLongPr = false;
    let loading = true;
    ifrContainer.style.cssText = `position: fixed;top: 0;left: 0;width: 100%;height: 100%;object-fit: cover;z-index: 9999999; pointer-events: none;`;
    cnsl.id = `satiCnsl`;
    const isBlock = cond => cond ? `block` : `none`;
    const bmarksMenu = document.createElement(`select`);
    bmarksMenu.style.cssText = `position:fixed;z-index:9999997;top:95%;right:10%;`;
    const bkmarks = window.localStorage.bookmarks || ``;
    bkmarks.trim().split(` `).forEach(lk => {
        const option = document.createElement(`option`);
        option.textContent = lk;
        option.value = lk;
        bmarksMenu.append(option);
    });
    let prevTimer;
    let prevZoomedIn;
    /* styles */
    trig.style.cssText = `position:fixed;bottom:10px;right:10px;width:30px;height:30px;background:${settings.trigColor};border-radius:50%;z-index:200000000;cursor:pointer;touch-action:auto;`;
    trig.textContent = `\u200b`;
    cnsl.style.cssText = `position:fixed;right:0px;width:120px;height:100vh;background-color:rgba(69,69,69,0.5);z-index:11111112;`;
    /* resetting */
    let zoomedIn = false;
    cnsl.style.display = `none`;
    linkIn.type = `text`;
    linkIn.style.cssText = `position:fixed;z-index:10000000;width:80%;height:5%;top:95%;background-color:rgba(255,255,255,0.3)`;
    ifr.style.cssText = `width: 100%; height: 100%;border: none; pointer-events: auto; transition: opacity 0.1s`;
    ifr.style.display = `none`;
    ifrContainer.append(ifr);
    document.body.append(ifrContainer, linkIn, trig, cnsl, bmarksMenu);
    /* yes i tried linkIn.list */
    let enabled = false;
    let inputHidden = false;
    let dev = false;
    let teacheraaa = false;
    let checking = false;
    let mouseInEdge = false;
    let ifrHistory = [];
    /* setup */
    const observer = new MutationObserver(mutList => {
        mutList.forEach(mut => { 
            if(mut.attributeName === `src`) {
                (linkIn.value = `${mut.target.src} ${lastUsedCommand}`);
                ifrHistory.push(mut.target.src);
                lastUsedCommand = ``;
                if(enabled) {
                    /* hiddenbot */
                    linkIn.value = `Hello World!`;
                    setTimeout(() => linkIn.value = ``, 2000);
                    if(ifr.src.startsWith(`https://bloxd.io`)) {
                        linkIn.value = `hmmm bloxd.io? Good choice! :D btw ${cmdTeach[Math.floor(Math.random() * cmdTeach.length)]}`;
                        setTimeout(() => {
                            linkIn.value = `just beware the brainrot... (Assuming your not a brainrot kid)`;
                        }, 1000);
                        setTimeout(() => linkIn.value = ifr.src, 3000);
                    }
                    if(ifr.src.startsWith(`https://poxel.io`)) {
                        linkIn.value = `no brainrot! Good choice! btw ${cmdTeach[Math.floor(Math.random() * cmdTeach.length)]}`;
                        setTimeout(() => linkIn.value = ifr.src, 2000);
                    }
                    if(ifr.src.startsWith(`web.archive.org`)) {
                        linkIn.value = `ur actually not a brainless kid. Wow! btw ${cmdTeach[Math.floor(Math.random() * cmdTeach.length)]}`;
                        setTimeout(() => linkIn.value = ifr.src, 2000);
                    }
                    /* the coding progression */
                    if(ifr.src.startsWith(`https://scratch.mit.edu`)) {
                        linkIn.value = `A start to ur coding journey!`;
                        setTimeout(() => linkIn.value = `Believe it or not, Even I started like this!`, 2000);
                        setTimeout(() => linkIn.value = `My recommendation after scratch is Python. I hope you can keep your interest in programming!`, 3000);
                        setTimeout(() => linkIn.value = ifr.src, 4000);
                    }
                    if(ifr.src.startsWith(`https://github.com`)) {
                        linkIn.value = `I hope ur not just a script copier... But ur going into code! Good!`;
                        setTimeout(() => linkIn.value = ifr.src, 2000);
                    }
                    if(ifr.src.startsWith(`https://stackoverflow.com`)) {
                        linkIn.value = `Dont worry, ur not stupid. Everyone goes through this.`;
                        setTimeout(() => linkIn.value = ifr.src, 3000);
                    }
                    if(ifr.src.endsWith(`.js`)) {
                        linkIn.value = `oh nah bros looking at some source code`;
                        setTimeout(() => linkIn.value = `Wish the teacher can support you on ur coding journey!`, 2000);
                        setTimeout(() => linkIn.value = ifr.src, 3000);
                    }
                    if(ifr.src.startsWith(`https://vscode.dev`)) {
                        linkIn.value = `yes yes code!!! (just beware the extensions not working)`;
                        setTimeout(() => linkIn.value = ifr.src, 3000);                        
                    }
                }
            }
            if(mut.attributeName === `style`) {
                ifr.style.opacity = isBlock(mut.target.style.display) ? 1 : 0;
            }
        });
    });
    const muterObserver = new MutationObserver(mutList => {
        document.querySelectorAll(`audio,video`).forEach(e => {
            e.muted = true;
        });
    });
    observer.observe(ifr, { attributes: true } );
    document.querySelectorAll(`audio,video`).forEach(e => {
        e.muted = true;
    });
    muterObserver.observe(document.body, { subtree: true, childList: true } );
    const closeIfr = () => {
        enabled = false;
        ifr.style.display = `none`;
    };
    let scriptTrigCl = () => {};
    let scriptIfrLd = () => {};
    const scriptVars = {};
    const parse = (script) => {
       let decls = script.split(`;`);
       let addThis = scriptCommands;
       decls = decls.filter(decl => decl !== ``)
                    .map(decl => 
                             decl.replaceAll(/rand\([0-9,]*\)/, 
                                             text => {
                                 let parts = text.substring(5, text.length - 1).split(`,`);
                                 let [first, second] = parts.map(x => +x);
                                 if(first && second) 
                                     return (first + Math.floor(Math.random() * (second - first + 1)));
                                 else if(first) 
                                     return Math.floor(Math.random() * first);
                                 else return Math.random();
                             }).matchAll(/\w+\s?=\s?.+/g).forEach(varStr => {
                                 let [varName, val] = varStr.replaceAll(` `, ``).split(`=`);
                                 scriptVars[varName] = Number.isNaN(+val) ? val : +val;
                                 let theVar = scriptVars[varName];
                                 if(scriptVars[varName][0] === `(`) {
                                     theVar[0] = `[`;
                                     theVar[theVar.length - 1] = `]`;
                                     scriptVars[varName] = JSON.parse(theVar);
                                 }
                             }));
       for(const [varName, val] of Object.entries(scriptVars)) {
           if(!(val.startsWith(`(`) && val.endsWith(`)`))) {
               decls = decls.map(decl => decl.replaceAll(`$${varName}`, val));
           } else {
               decls = decls.map(decl => decl.replaceAll(new RegExp(`$${varName}\\(\\d+\\)`), text => val[+(text.split(`(`)[1].split(`)`)[0])]));
           }
       }
       decls.forEach(decl => {
           if(decl.includes(`?`)) {
               let cond = decl.split(`?`)[0];
               let theRest = decl.split(`?`).slice(1, decl.length).join(`?`);
               let [trueAction, falseAction] = theRest.split(` else `);
               if(eval(cond)) {
                   trueAction.split(`+`).forEach(cmd => runCommand(cmd));
               } else if(falseAction) {
                   falseAction.split(`+`).forEach(cmd => runCommand(cmd));
               }
           }
       });
       decls.forEach(decl => {
           let parts = decl.split(`=>`);
           let [commandName, content] = parts.map(st => st.trim());
           addThis[commandName] = content;
           if(commandName === `ontrigclick`) {
               scriptTrigCl = () => {
                   content.split(`+`).forEach(cmd => runCommand(cmd));
               };
           }
           if(commandName === `onload`) {
               scriptIfrLd = () => {
                   content.split(`+`).forEach(cmd => runCommand(cmd));
               };
           }
       });
       window.localStorage.scriptCommands = JSON.stringify(addThis);
    };
    const runCommand = (text) => {
        if(text === `/cr`) {
            alert(`Main coding: Rustu\nOriginal Idea: Isaac`);
        }
        if(text === `/sh`) {
            navigator.clipboard.writeText(ifr.src);
            linkIn.value = `Copied`;
            setTimeout(() => linkIn.value = ifr.src, 500);
        }
        if(text === `/rl`) {
            ifr.src = ifr.src;
            linkIn.value = ifr.src;
        }
        if(text === `/hs`) {
            linkIn.style.display = `none`;
            inputHidden = true;
        }
        if(text.split(` `)[0] === `/r`) {
            let parts = text.split(` `);
            linkIn.value = ifrHistory[ifrHistory.length - Number(parts[1])];
        }
        if(text.split(` `)[0] === `/m`) {
            let parts = text.split(` `);
            linkIn.value = eval(parts[1].replaceAll(`sqrt`, `Math.sqrt`).replaceAll(`pi`, `Math.PI`).replaceAll(`x`, `*`).replaceAll(`^`, `**`));
        }
        if(text.split(` `)[0] === `/nh`) {
            let parts = text.split(` `);
            let addThis = window.localStorage.noHide ? JSON.parse(window.localStorage.noHide) : [];
            let [, start, end] = parts;
            let [startHr, startMin] = start.split(`:`).map(s => +s);
            let [endHr, endMin] = end.split(`:`).map(s => +s);
            if(parts[3] !== `del`) {
                addThis.push({ 
                    startTime: startHr * 60 + startMin,
                    endTime: endHr * 60 + endMin
                });
            } else {
                addThis = addThis.filter(d => 
                                        (d.startTime !== startHr * 60 + startMin) &&
                                        (d.endTime !== endHr * 60 + endMin));
            }
            window.localStorage.noHide = JSON.stringify(addThis);
            linkIn.value = ``;
        }
        if(text === `/bp`) {
            const backup = {
                settings: window.localStorage.settings,
                bookmarks: window.localStorage.bookmarks,
                commands: window.localStorage.commands,
                notes: window.localStorage.notes,
                noHide: window.localStorage.noHide
            };
            navigator.clipboard.writeText(JSON.stringify(backup));
            linkIn.value = `Copied backup!`;
            setTimeout(() => linkIn.value = ifr.src, 2000);
        }
        if(text.split(` `)[0] === `/re`) {
            let string = text.substring(4);
            let obj = JSON.parse(string);
            for(const [key, val] of Object.entries(obj)) {
                window.localStorage[key] = val;
            }
            linkIn.value = `Restored backup!`;
            setTimeout(() => linkIn.value = ifr.src, 2000);
        }
        if(text.split(` `)[0] === `/n`) {
            let parts = text.split(` `);
            let noteName = parts[1];
            let noteContent = parts.length > 2 ? parts.slice(2, parts.length).join(` `) : undefined;
            let addThis = window.localStorage.notes ? JSON.parse(window.localStorage.notes) : {};
            if(!noteName) {
                linkIn.value = `note names: ${Object.keys(addThis).join(`, `)}`;
            }
            if(noteContent) {
                addThis[noteName] = noteContent;
            } else {
                linkIn.value = addThis[noteName] || `note not found. my code is probably correct, so set a note using /n <name> <note>`;
            }
            window.localStorage.notes = JSON.stringify(addThis);
            setTimeout(() => linkIn.value = ``, 3000);
        }
        if(text === `/cmds`) {
            alert(`commands are: 
                   ${[...Object.keys(commands), ...defaultCommands].join(`, `)}`);
            linkIn.value = ``;
        }
        if(text === `/dv ${password}`) {
            cnsl.style.display = `block`;
            cnsl.innerText += `ur dev`;
            dev = true;
            linkIn.value = ``;
        }
        if(text === `/gk`) {
            if(!dev) { 
                alert(`poor you trying commands without dev`);
                return;
            }
            const digs = [`0`, `3`, `6`, `9`];
            let result = ``;
            for(let i = 0; i <= 6; i++) {
                result += digs[Math.floor(Math.random() * 4)];
            }
            result = result.slice(0, -1) + `0`;
            let arr = result.split(``);
            [2, 5, 7].forEach(num => {
                arr.splice(Math.floor(Math.random() * result.length),
                           0, `${num}`);
            });
            alert(Number(arr.join(``)).toString(16));
            linkIn.value = ``;
        }
        if(text === `/tc`) {
            cnsl.style.display = isBlock(cnsl.style.display === `none`);
        }
        if(text.split(` `)[0] === `/tr`) {
            let params = text.split(` `);
            ifr.style.opacity = Number(params[1]);
            linkIn.value = ``;
        }
        if(text.split(` `)[0] === `/bk`) {
            let parts = text.split(` `);
            const link = 
                parts[1] ? parts[1] : ifr.src;
            window.localStorage.bookmarks += `${link} `;
            const option = document.createElement(`option`);
            option.textContent = link;
            option.value = link;
            bmarksMenu.append(option);
            linkIn.value = ``;
        }
        if(text.split(` `)[0] === `/br`) {
            let parts = text.split(` `);
            const bkmarks = window.localStorage.bookmarks.trim();
            let bkmarksArr = bkmarks.split(` `);
            bkmarksArr = bkmarksArr.filter(lk => lk !== parts[1]);
            window.localStorage.bookmarks = bkmarksArr.join(` `) + ` `;
            document.querySelector(`option[value="${parts[1]}"]`)
                .remove();
            linkIn.value = ``;
        }
        if(text === `/bc`) {
            window.localStorage.bookmarks = ``;
            bmarksMenu.innerHTML = ``;
            linkIn.value = ``;
        }
        if(text.split(` `)[0] === `/s`) {
            const parts = text.split(` `);
            const addThis = JSON.parse(window.localStorage.settings);
            if(parts[1] === `htimer`) {
                settings.hideTime = Number(parts[2]);
                addThis.hideTime = Number(parts[2]);
            }
            if(parts[1] === `dcolor`) {
                settings.trigColor = parts[2];
                trig.style.background = parts[2];
                addThis.trigColor = parts[2];
            }
            if(parts[1] === `vol`) {
                settings.vol = Number(parts[2]) / 100;
                document.querySelectorAll(`audio,video`).forEach(elem => {
                    elem.volume = Number(parts[2]) / 100;
                });
                addThis.vol = Number(parts[2]) / 100;
            }
            window.localStorage.settings = JSON.stringify(addThis);
            linkIn.value = ``;
        }
        if(text.split(` `)[0] === `/sc`) {
            let content = text.split(` `).slice(1, text.length);
            if(!scriptVars.bkmarks) runCommand(`/sc bkmarks = (${bkmarks.replaceAll(` `, `,`)})`);
            parse(content.join(` `));
        }
        if(text.split(` `)[0] === `/cc`) {
            const parts = text.split(` `);
            commands[parts[1]] = parts.slice(2, parts.length).join(` `);
            window.localStorage.commands = JSON.stringify(commands);
            linkIn.value = ``;
        } else {
            for(const [cmd, run] of Object.entries(commands)) {
                if(text.split(` `)[0] === cmd) {
                    let runCopy = run;
                    text.split(` `).forEach((part, ind) => {
                        runCopy = runCopy.replaceAll(`{${ind}}`, part);
                    });
                    if(linkRegex.test(runCopy)) {
                        ifr.src = runCopy;
                        enabled = true;
                        ifr.style.display = `block`;
                    } else if(cmdRegex.test(runCopy)) {
                        runCommand(runCopy);
                    } else if(linkCmdRegex.test(runCopy)) {
                        const parts = runCopy.split(` `);
                        ifr.src = parts[0];
                        enabled = true;
                        ifr.style.display = `block`;
                        runCommand(parts.slice(1, parts.length).join(` `));
                    }
                }
            }
            for(const [cmd, run] of Object.entries(scriptCommands)) {
                run.split(`+`).forEach(cmd => {
                  if(linkRegex.test(cmd)) {
                      ifr.src = cmd;
                      enabled = true;
                      ifr.style.display = `block`;
                  } else if(cmdRegex.test(cmd)) {
                      runCommand(cmd);
                  } else if(linkCmdRegex.test(cmd)) {
                      const parts = cmd.split(` `);
                      ifr.src = parts[0];
                      enabled = true;
                      ifr.style.display = `block`;
                      runCommand(parts.slice(1, parts.length).join(` `));
                  }
                });
            }
            linkIn.value = ``;
        }
    };
    let prevAlpha;
    ifr.addEventListener(`error`, ev => {
        linkIn.value = `hmmm. Website didnt load. did u type da link wrong? yk my autocorrect isnt powered by chatgpt`;
        setTimeout(() => linkIn.value = ifr.src, 3000);
    });
    ifr.addEventListener(`load`, ev => {
        linkIn.value = ifr.src;
        loading = false;
        scriptIfrLd();
    });
    bmarksMenu.addEventListener(`change`, ev => {
        linkIn.value = ev.target.value;
    });
    ifr.addEventListener(`touchstart`, ev => {
        if(ev.clientX < 30) { 
            ev.preventDefault();
            ev.stopPropagation();
            mouseInEdge = true;
        }
    }, true);
    ifr.addEventListener(`touchend`, ev => {
        if(mouseInEdge) {
            ev.preventDefault();
            ev.stopPropagation();
            ifrHistory.pop();
            ifr.src = ifrHistory[ifrHistory.length - 1];
            mouseInEdge = false;
        }
    }, true);
    const trigCl = ev => {
        if(isLongPr) {
            isLongPr = false;
            return;
        }
        isLongPr = false;
            trig.style.opacity = 0.6;
            setTimeout(() => trig.style.opacity = 1, 400);
            if(inputHidden) { 
                inputHidden = false;
                linkIn.style.display = `block`;
                return;
            }
            if(!enabled) {
                if(linkIn.value[0] === `/`) {
                    runCommand(linkIn.value);
                } else if(linkIn.value !== `` &&
                          (/^https[:;][/\\]{2}/).test(linkIn.value.substring(0, 8))) {
                    const parts = linkIn.value.split(` `);
                    const baseLink = parts[0]
                    /* autocorrect */
                        .replaceAll(`..`, `.`)
                        .replaceAll(/\.(c|o|m){3}/g, `.com`)
                        .replaceAll(/^w[:;]/, `https://`)
                        .replaceAll(/^https[:;][/\\]{2}/g, `https://`)
                        .replaceAll(`.oi`, `.io`)
                        .replaceAll(/\.(o|r|g){3}/g, `.org`);
                    const cmd = parts.slice(1, parts.length);
                    linkIn.value = baseLink;
                    if(baseLink !== ifr.src) ifr.src = baseLink;
                    linkIn.value = loading ? `the websites loading. bruh how bad is the school wifi lol` : ifr.src;
                    ifr.style.display = `block`;
                    enabled = true;
                    ifr.focus();
                    runCommand(cmd.join(` `));
                    lastUsedCommand = cmd.join(` `);
                } else if(linkIn.value.startsWith(`javascript:`) && dev) {
                    try {
                        const code = toSpecialCode(linkIn.value);
                        cnsl.innerText += `\n<<<${code}`;
                        cnsl.innerText += `\n>>>${eval(code)}`;
                    } catch(err) { cnsl.innerText += `Error: ${err}`; }
                } else {
                    linkIn.value = `bro is NOT getting away for typing random stuff (yes it works)`;
                    setTimeout(() => linkIn.value = ``, 3000);
                }
            } else {
                ifr.style.display = `none`;
                enabled = false;
                linkIn.value = ifr.src;
            }
        scriptTrigCl();
    };
    bmarksMenu.addEventListener(`click`, ev => {
        if(bmarksMenu.options.length === 0) {
            linkIn.value = `do /bk after typing a link to add it to bookmarks (here)`;
        }
    });
    linkIn.addEventListener(`keydown`, ev => {
        if(ev.key === `Enter`) {
            trigCl(null);
        }
    });
    trig.addEventListener(`click`, trigCl);
    document.body.addEventListener(`touchstart`, () => {});/*required*/
    document.body.addEventListener(`touchend`, ev => {
        const noHideArr = JSON.parse(window.localStorage.noHide || `[]`);
        const cur = new Date();
        const curMins = cur.getHours() * 60 + cur.getMinutes();
        if(enabled && !(noHideArr.some(obj => 
                         (obj.startTime <= curMins) &&
                         (obj.endTime >= curMins)))) {
            if(prevTimer) clearTimeout(prevTimer);
            prevTimer = setTimeout(closeIfr, settings.hideTime);
        }
    });
    
    window.addEventListener(`gesturestart`, ev => enabled && ev.preventDefault(), true);
    window.addEventListener(`gesturechange`, ev => enabled && ev.preventDefault(), true);
    window.addEventListener(`gestureend`, ev => {
        ev.preventDefault();
        if(ev.rotation > 45 && !teacheraaa) {
            teacheraaa = true;
            ifr.style.display = linkIn.style.display = trig.style.display = bmarksMenu.style.display = `none`;
            if(dev) cnsl.style.display = `none`;
        }
        if(ev.rotation < -45 && teacheraaa) {
            enabled = true;
            teacheraaa = false;
            ifr.style.display = linkIn.style.display = trig.style.display = bmarksMenu.style.display = `block`;
            ifr.focus();
            if(dev) cnsl.style.display = `block`;
        }
    }, true);
})();
