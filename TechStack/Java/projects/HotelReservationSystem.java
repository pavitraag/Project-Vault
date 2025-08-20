import java.sql.*;
import java.util.*;

public class HotelReservationSystem {
    private static final String URL = "jdbc:mysql://localhost:3306/hotel_db";
    private static final String USER = "root"; // change if needed
    private static final String PASS = "root"; // change if needed

    private Connection conn;
    private Scanner sc;

    public HotelReservationSystem() {
        try {
            conn = DriverManager.getConnection(URL, USER, PASS);
            sc = new Scanner(System.in);
        } catch (SQLException e) {
            System.out.println("DB Connection Failed: " + e.getMessage());
            System.exit(0);
        }
    }

    // Show available rooms
    private void showAvailableRooms() throws SQLException {
        String query = "SELECT * FROM rooms WHERE is_booked = FALSE";
        Statement st = conn.createStatement();
        ResultSet rs = st.executeQuery(query);
        System.out.println("\n--- Available Rooms ---");
        while (rs.next()) {
            System.out.println("Room " + rs.getString("room_number") +
                    " | Type: " + rs.getString("type") +
                    " | Price: ₹" + rs.getDouble("price"));
        }
    }

    // Book a room
    private void bookRoom() throws SQLException {
        showAvailableRooms();
        System.out.print("Enter Room Number to Book: ");
        String roomNumber = sc.next();

        // check if available
        String check = "SELECT room_id FROM rooms WHERE room_number=? AND is_booked=FALSE";
        PreparedStatement pst = conn.prepareStatement(check);
        pst.setString(1, roomNumber);
        ResultSet rs = pst.executeQuery();

        if (rs.next()) {
            int roomId = rs.getInt("room_id");
            System.out.print("Enter Customer Name: ");
            sc.nextLine(); // consume newline
            String name = sc.nextLine();
            System.out.print("Enter Phone: ");
            String phone = sc.next();

            String insert = "INSERT INTO customers(name, phone, room_id) VALUES(?,?,?)";
            PreparedStatement pst2 = conn.prepareStatement(insert);
            pst2.setString(1, name);
            pst2.setString(2, phone);
            pst2.setInt(3, roomId);
            pst2.executeUpdate();

            String update = "UPDATE rooms SET is_booked=TRUE WHERE room_id=?";
            PreparedStatement pst3 = conn.prepareStatement(update);
            pst3.setInt(1, roomId);
            pst3.executeUpdate();

            System.out.println("✅ Room booked successfully for " + name);
        } else {
            System.out.println("❌ Room not available.");
        }
    }

    // Check out
    private void checkOut() throws SQLException {
        System.out.print("Enter Customer ID to check out: ");
        int cid = sc.nextInt();

        String query = "SELECT room_id FROM customers WHERE customer_id=?";
        PreparedStatement pst = conn.prepareStatement(query);
        pst.setInt(1, cid);
        ResultSet rs = pst.executeQuery();

        if (rs.next()) {
            int roomId = rs.getInt("room_id");

            String updateRoom = "UPDATE rooms SET is_booked=FALSE WHERE room_id=?";
            PreparedStatement pst1 = conn.prepareStatement(updateRoom);
            pst1.setInt(1, roomId);
            pst1.executeUpdate();

            String deleteCustomer = "DELETE FROM customers WHERE customer_id=?";
            PreparedStatement pst2 = conn.prepareStatement(deleteCustomer);
            pst2.setInt(1, cid);
            pst2.executeUpdate();

            System.out.println("✅ Customer checked out and room is now available.");
        } else {
            System.out.println("❌ Customer not found.");
        }
    }

    // Menu
    public void start() {
        while (true) {
            try {
                System.out.println("\n--- Hotel Reservation System ---");
                System.out.println("1. Show Available Rooms");
                System.out.println("2. Book Room");
                System.out.println("3. Check Out");
                System.out.println("4. Exit");
                System.out.print("Enter choice: ");
                int choice = sc.nextInt();

                switch (choice) {
                    case 1 -> showAvailableRooms();
                    case 2 -> bookRoom();
                    case 3 -> checkOut();
                    case 4 -> { 
                        System.out.println("Exiting...");
                        return;
                    }
                    default -> System.out.println("Invalid choice.");
                }
            } catch (Exception e) {
                System.out.println("Error: " + e.getMessage());
            }
        }
    }

    // Main
    public static void main(String[] args) {
        new HotelReservationSystem().start();
    }
}
