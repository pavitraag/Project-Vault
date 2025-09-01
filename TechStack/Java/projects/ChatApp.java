import java.io.*;
import java.net.*;
import java.util.*;
import java.util.concurrent.*;

/**
 * ChatApp.java
 * Usage:
 *   Server: java ChatApp server <port>
 *   Client: java ChatApp client <host> <port> <name>
 *
 * Example:
 *   Terminal 1 -> java ChatApp server 5000
 *   Terminal 2 -> java ChatApp client 127.0.0.1 5000 Alice
 *   Terminal 3 -> java ChatApp client 127.0.0.1 5000 Bob
 *
 * Commands (client):
 *   /quit    -> disconnect
 */
public class ChatApp {

    // ---------- entry ----------
    public static void main(String[] args) {
        if (args.length == 0) {
            usage();
            return;
        }
        switch (args[0].toLowerCase()) {
            case "server":
                int port = (args.length >= 2) ? parsePort(args[1]) : 5000;
                new ChatServer(port).start();
                break;
            case "client":
                if (args.length < 4) {
                    System.out.println("Client usage: java ChatApp client <host> <port> <name>");
                    return;
                }
                String host = args[1];
                int p = parsePort(args[2]);
                String name = args[3];
                new ChatClient(host, p, name).start();
                break;
            default:
                usage();
        }
    }

    private static void usage() {
        System.out.println("Usage:");
        System.out.println("  Server: java ChatApp server <port>");
        System.out.println("  Client: java ChatApp client <host> <port> <name>");
    }

    private static int parsePort(String s) {
        try { return Integer.parseInt(s); }
        catch (Exception e) { return 5000; }
    }

    // ---------- server ----------
    static class ChatServer {
        private final int port;
        private final Set<ClientHandler> clients = ConcurrentHashMap.newKeySet();

        ChatServer(int port) { this.port = port; }

        void start() {
            System.out.println("[Server] Starting on port " + port + " ...");
            try (ServerSocket serverSocket = new ServerSocket(port)) {
                System.out.println("[Server] Listening on " + serverSocket.getLocalPort());
                while (true) {
                    Socket socket = serverSocket.accept();
                    ClientHandler handler = new ClientHandler(socket);
                    clients.add(handler);
                    new Thread(handler, "ClientHandler-" + socket.getPort()).start();
                }
            } catch (IOException e) {
                System.out.println("[Server] Error: " + e.getMessage());
            }
        }

        void broadcast(String from, String message) {
            String payload = (from == null ? "" : "[" + from + "] ") + message;
            for (ClientHandler ch : clients) {
                ch.send(payload);
            }
        }

        void remove(ClientHandler ch) {
            clients.remove(ch);
        }

        class ClientHandler implements Runnable {
            private final Socket socket;
            private PrintWriter out;
            private BufferedReader in;
            private String name = "Anonymous";

            ClientHandler(Socket socket) { this.socket = socket; }

            public void run() {
                try {
                    in  = new BufferedReader(new InputStreamReader(socket.getInputStream(), "UTF-8"));
                    out = new PrintWriter(new OutputStreamWriter(socket.getOutputStream(), "UTF-8"), true);

                    // first line from client is the desired name
                    String proposed = in.readLine();
                    if (proposed != null && !proposed.trim().isEmpty()) name = proposed.trim();
                    out.println("Welcome " + name + "! Type /quit to exit.");
                    broadcast("Server", name + " joined the chat.");

                    String line;
                    while ((line = in.readLine()) != null) {
                        if (line.trim().equalsIgnoreCase("/quit")) {
                            break;
                        }
                        if (!line.trim().isEmpty()) {
                            broadcast(name, line);
                        }
                    }
                } catch (IOException e) {
                    // connection issue
                } finally {
                    close();
                }
            }

            void send(String msg) {
                try {
                    if (out != null) out.println(msg);
                } catch (Exception ignored) { }
            }

            void close() {
                try { socket.close(); } catch (IOException ignored) {}
                remove(this);
                broadcast("Server", name + " left the chat.");
            }
        }
    }

    // ---------- client ----------
    static class ChatClient {
        private final String host;
        private final int port;
        private final String name;

        ChatClient(String host, int port, String name) {
            this.host = host; this.port = port; this.name = name;
        }

        void start() {
            System.out.println("[Client] Connecting to " + host + ":" + port + " as " + name + " ...");
            try (Socket socket = new Socket(host, port);
                 BufferedReader serverIn = new BufferedReader(new InputStreamReader(socket.getInputStream(), "UTF-8"));
                 PrintWriter serverOut   = new PrintWriter(new OutputStreamWriter(socket.getOutputStream(), "UTF-8"), true);
                 BufferedReader userIn   = new BufferedReader(new InputStreamReader(System.in))) {

                // send our name first
                serverOut.println(name);

                // reader thread: prints server messages
                Thread reader = new Thread(() -> {
                    try {
                        String line;
                        while ((line = serverIn.readLine()) != null) {
                            System.out.println(line);
                        }
                    } catch (IOException ignored) { }
                    System.out.println("[Client] Disconnected.");
                    System.exit(0);
                }, "ServerReader");
                reader.setDaemon(true);
                reader.start();

                // main thread: reads user input and sends
                String input;
                while ((input = userIn.readLine()) != null) {
                    serverOut.println(input);
                    if (input.trim().equalsIgnoreCase("/quit")) break;
                }
            } catch (IOException e) {
                System.out.println("[Client] Error: " + e.getMessage());
            }
        }
    }
}
