const general = {
    isValidURL: (string, protocols) => {
        let url;

        try {
            url = new URL(string);
        } catch (_) {
            return false;
        }

        return protocols.includes(url.protocol.slice(0, -1));
    }
};

export default general;