import { notImplemented } from "./util";

export default function unistd({
  fs,
  os,
  process,
  recv,
  send,
  wasi,
  posix,
  memory,
}) {
  let login: number | undefined = undefined;

  const unistd = {
    chown: (pathPtr: number, uid: number, gid: number): -1 | 0 => {
      const path = recv.string(pathPtr);
      fs.chownSync(path, uid, gid);
      return 0;
    },
    lchown: (pathPtr: number, uid: number, gid: number): -1 | 0 => {
      const path = recv.string(pathPtr);
      fs.lchownSync(path, uid, gid);
      return 0;
    },

    // int fchown(int fd, uid_t owner, gid_t group);
    fchown: (fd: number, uid: number, gid: number): number => {
      const entry = wasi.FD_MAP.get(fd);
      if (!entry) {
        console.warn("bad file descriptor, fchown");
        return -1;
      }
      fs.fchownSync(entry.real, uid, gid);
      return 0;
    },

    getuid: () => process.getuid?.() ?? 0,
    getgid: () => process.getgid?.() ?? 0,
    geteuid: () => process.geteuid?.() ?? 0,
    getegid: () => process.getegid?.() ?? 0,

    // int getgroups(int gidsetsize, gid_t grouplist[]);
    // in WASI, "typedef unsigned gid_t"
    getgroups: (gidsetsize, grouplistPtr): number => {
      const groups = process.getgroups?.();
      if (groups == null) {
        return 0; // no groups
      }
      if (gidsetsize == 0) {
        // yep, we end up computing getgroups twice, since the
        // posix api is a bit awkward...
        return groups.length;
      }
      const count = Math.min(groups.length, gidsetsize);
      if (count == 0) {
        return 0;
      }
      const view = new DataView(memory.buffer);
      for (let i = 0; i < count; i++) {
        view.setUint32(grouplistPtr + 4 * i, groups[i], true);
      }
      return count;
    },

    getpid: () => process.pid ?? 1,

    getpgid: (pid: number): number => {
      return posix.getpgid?.(pid) ?? 1;
    },

    // int setpgid(pid_t pid, pid_t pgid);
    setpgid: (pid: number, pgid: number): number => {
      if (posix.setpgid == null) {
        notImplemented("setpgid");
      }
      posix.setpgid(pid, pgid);
      return 0; // success
    },

    getpgrp: (): number => {
      return posix.getpgrp?.() ?? 1;
    },

    nice: (incr: number) => {
      const p = os.getPriority?.();
      if (p != null) {
        os.setPriority?.(p + incr);
      }
    },
    //     int getpriority(int which, id_t who);
    getpriority: (which: number, who: number): number => {
      if (os.getPriority == null) {
        // environ with no info about processes (e.g., browser).
        return 0;
      }
      if (which != 0) {
        console.warn(
          "getpriority can only be implemented in node.js for *process id*"
        );
        return 0; // minimal info.
      }
      return os.getPriority?.(who);
    },

    //   int setpriority(int which, id_t who, int value);
    setpriority: (which: number, who: number, value: number): number => {
      if (os.setPriority == null) {
        // environ with no info about processes (e.g., browser).
        return 0;
      }
      if (which != 0) {
        console.warn(
          "setpriority can only be implemented in node.js for *process id*"
        );
        return -1;
      }
      return os.setPriority?.(who, value);
    },

    dup: () => {
      // Considered in 2022, but closed by node developers: https://github.com/libuv/libuv/issues/3448#issuecomment-1174786218
      // TODO: maybe revisit via the wasi layer when want to have a deeper understanding of whether this is possible
      // on top of that abstraction, and of course emscripten does this (?)
      throw Error(
        "NotImplemented -- it might not be reasonable to implement file descriptor dup"
      );
    },

    dup2: () => {
      throw Error(
        "NotImplemented -- it might not be reasonable to implement file descriptor dup2"
      );
    },

    dup3: () => {
      throw Error(
        "NotImplemented -- it might not be reasonable to implement file descriptor dup3"
      );
    },

    sync: () => {
      // nodejs doesn't expose sync, but it does expose fsync for a file descriptor, so we call it on
      // all the open file descriptors
      if (fs.fsyncSync == null) return;
      for (const [_, { real }] of wasi.FD_MAP) {
        fs.fsyncSync(real);
      }
    },

    // In nodejs these set*id function can't be done in a worker thread:
    // https://nodejs.org/api/process.html#processsetgidid
    // TODO: maybe we should implement these by sending a message to
    // the main thread requesting to do them?  For now, you'll get
    // an error unless you run in a mode without a worker thread.
    setuid: () => {
      throw Error("setuid is not supported");
    },
    seteuid: (uid: number) => {
      if (posix.seteuid == null) {
        notImplemented("seteuid");
      }
      posix.seteuid(uid);
      return 0;
    },
    setegid: (gid: number) => {
      if (posix.setegid == null) {
        notImplemented("setegid");
      }
      posix.setegid(gid);
      return 0;
    },
    setgid: (gid: number) => {
      if (process.setgid == null) {
        notImplemented("setgid");
      }
      process.setgid(gid);
      return 0;
    },
    setsid: (sid) => {
      if (posix.setsid == null) {
        notImplemented("setsid");
      }
      return posix.setsid(sid);
    },
    // TODO!
    getsid: () => {
      notImplemented("getsid");
    },

    setreuid: (uid) => {
      if (posix.setreuid == null) {
        notImplemented("setreuid");
      }
      posix.setreuid(uid);
      return 0;
    },
    setregid: (gid) => {
      if (posix.setregid == null) {
        notImplemented("setregid");
      }
      posix.setregid(gid);
      return 0;
    },
    getppid: () => {
      if (posix.getppid == null) {
        // in browser -- only one process id:
        return unistd.getpid();
      }
      return posix.getppid();
    },
    setgroups: () => {
      notImplemented("setgroups");
    },

    setpgrp: () => {
      notImplemented("setpgrp");
    },

    tcgetpgrp: () => {
      notImplemented("tcgetpgrp");
    },

    tcsetpgrp: () => {
      notImplemented("tcsetpgrp");
    },

    fork: () => {
      notImplemented("fork");
    },

    fork1: () => {
      notImplemented("fork1");
    },

    forkpty: () => {
      notImplemented("forkpty");
    },

    getlogin: (): number => {
      if (login != null) return login;
      // returns the username of the signed in user; if not available, e.g.,
      // in a browser, returns "user".
      const username = os.userInfo?.()?.username ?? "user";
      login = send.string(username);
      if (login == null) throw Error("bug");
      return login;
    },

    // int gethostname(char *name, size_t len);
    gethostname: (namePtr: number, len: number): number => {
      if (os.hostname == null) {
        throw Error("gethostname not supported on this platform");
      }
      const name = os.hostname();
      send.string(name, { ptr: namePtr, len });
      return 0;
    },

    // int sethostname(const char *name, size_t len);
    sethostname: (namePtr: number, len: number): number => {
      if (posix.sethostname == null) {
        throw Error("sethostname not supported on this platform");
      }
      const name = recv.string(namePtr, len);
      posix.sethostname(name);
      return 0;
    },

    // char *ttyname(int fd);
    // int ttyname_r(int fd, char *buf, size_t buflen);
    ttyname_r: (fd: number, ptr: number, len: number): number => {
      if (posix.ttyname == null) {
        throw Error("ttyname_r is not supported on this platform");
      }
      send.string(posix.ttyname(fd), { ptr, len });
      return 0;
    },

    alarm: (seconds: number): number => {
      if (posix.alarm == null) {
        throw Error("alarm is not supported on this platform");
      }
      return posix.alarm(seconds);
    },

    // The following 4 are actually only available on a Linux host, though wasi-musl defines them,
    // so cpython-wasm thinks they exist.
    getresuid: (ruidPtr: number, euidPtr: number, suidPtr: number): number => {
      if (posix.getresuid == null) {
        notImplemented("getresuid");
      }
      const { ruid, euid, suid } = posix.getresuid();
      const view = new DataView(memory.buffer);
      view.setUint32(ruidPtr, ruid, true);
      view.setUint32(euidPtr, euid, true);
      view.setUint32(suidPtr, suid, true);
      return 0;
    },

    getresgid: (rgidPtr: number, egidPtr: number, sgidPtr: number): number => {
      if (posix.getresgid == null) {
        notImplemented("getresgid");
      }
      const { rgid, egid, sgid } = posix.getresgid();
      const view = new DataView(memory.buffer);
      view.setUint32(rgidPtr, rgid, true);
      view.setUint32(egidPtr, egid, true);
      view.setUint32(sgidPtr, sgid, true);
      return 0;
    },

    setresuid: (ruid: number, euid: number, suid: number): number => {
      if (posix.setresuid == null) {
        notImplemented("setresuid");
      }
      posix.setresuid(ruid, euid, suid);
      return 0;
    },

    setresgid: (rgid: number, egid: number, sgid: number): number => {
      if (posix.setresgid == null) {
        notImplemented("setresgid");
      }
      posix.setresgid(rgid, egid, sgid);
      return 0;
    },

    // int execve(const char *pathname, char *const argv[], char *const envp[]);
    execve: (pathnamePtr: number, argvPtr: number, envpPtr: number): number => {
      if (posix.execve == null) {
        notImplemented("execve");
      }
      console.log("execve", { pathnamePtr, argvPtr, envpPtr });
      const pathname = recv.string(pathnamePtr);
      const argv = recv.arrayOfStrings(argvPtr);
      const envp = recv.arrayOfStrings(envpPtr);
      console.log("execve", { pathname, argv, envp });
      posix.execve(pathname, argv, envp);
      return 0; // this won't happen because execve takes over
    },
  };

  return unistd;
}
