const getUserRights: any = (module: string) => {
  if (typeof window !== "undefined") {
    let adminPrivileges =
      localStorage.getItem("userDetails") &&
      JSON.parse(localStorage.getItem("userDetails") ?? "")?.privileges;

    if (adminPrivileges) {
      const findModuleRights: any = adminPrivileges.find(
        (privilege: any) => privilege.module === module
      );

      const canRead = () => {
        return findModuleRights && findModuleRights?.read;
      };

      const canWrite = () => {
        return findModuleRights && findModuleRights?.write;
      };

      const canDelete = () => {
        return findModuleRights && findModuleRights?.delete;
      };

      return {
        canRead,

        canWrite,

        canDelete,
      };
    }
  }
};

export default getUserRights;
